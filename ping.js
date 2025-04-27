const got = require('got');
const { HttpsProxyAgent } = require('https-proxy-agent');
const http = require('http');
const https = require('https');

// SET YOUR PROXY CREDENTIALS HERE
const proxy = 'http://proxy_username:proxy_passwort@proxy-hostname.com:port';

const target = 'http://130.136.1.142'; // University of Bologna (Still using HTTP in 2025? LOL! xD)
const rounds = 10;
const concurrency = 1;

const proxyAgent = new HttpsProxyAgent(proxy);
proxyAgent.setMaxListeners(0); // Avoid MaxListeners warning

// Custom HTTP(S) agents with keep-alive & TCP_NODELAY
const keepAliveAgent = {
  http: new http.Agent({ keepAlive: true }),
  https: new https.Agent({ keepAlive: true }),
};

function getHighResTime() {
  return process.hrtime.bigint(); // nanoseconds
}

function diffMs(start, end) {
  return Number(end - start) / 1e6; // convert to ms
}

async function pingOnce(index) {
  const start = getHighResTime();
  try {
    const res = await got(target, {
      agent: {
        http: proxyAgent,   // proxies HTTP
        https: proxyAgent,  // proxies HTTPS
      },
      method: 'HEAD',
      decompress: false,
      retry: 0,
      timeout: { request: 10000 },
      hooks: {
        beforeRequest: [
          options => {
            // Force TCP_NODELAY on the socket
            options.agent?.https?.on('connect', (_, socket) => {
              socket.setNoDelay(true);
            });
          },
        ],
      },
    });

    const latency = res.timings.phases.wait;
    console.log(`[✓] Ping ${index + 1} → ${latency.toFixed(1)} ms`);
    return latency;

  } catch (err) {
    console.log(`[x] Ping ${index + 1} failed: ${err.message}`);
    return null;
  }
}

async function runPings() {
  const results = [];
  for (let i = 0; i < rounds; i += concurrency) {
    const batch = Array(Math.min(concurrency, rounds - i))
      .fill(0)
      .map((_, idx) => pingOnce(i + idx));
    const res = await Promise.all(batch);
    results.push(...res);
  }

  const latencies = results.filter(x => x !== null);
  if (latencies.length === 0) {
    console.log('No successful pings.');
    return;
  }

  latencies.sort((a, b) => a - b);
  const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length;
  const median = latencies[Math.floor(latencies.length / 2)];

  console.log('\n=== Latency Stats ===');
  console.log(`Total: ${rounds}, Success: ${latencies.length}, Failures: ${rounds - latencies.length}`);
  console.log(`Min: ${latencies[0].toFixed(1)} ms`);
  console.log(`Avg: ${avg.toFixed(1)} ms`);
  console.log(`Median: ${median.toFixed(1)} ms`);
  console.log(`Max: ${latencies[latencies.length - 1].toFixed(1)} ms`);
}

runPings();
