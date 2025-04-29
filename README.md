[https://pingwithproxy.com/](https://pingwithproxy.com/)

# HTTP(S) Proxy Latency Tester v0.1
Part of the [Proxy Report Suite](http://proxy.report/)

A high-precision **HTTP(S) proxy latency measurement tool** written in **Node.js**. Inspired by **fast.com** and **httping**, it measures **time-to-first-byte (TTFB)** across multiple HTTP pings via proxies, with a focus on **low latency** and **high accuracy**.

- Uses **nanosecond timing** via `process.hrtime.bigint()`
- Disables **Nagle's algorithm** (`TCP_NODELAY`) for minimal delay
- Supports **HTTP(S) proxies** with authentication
- Measures **unloaded latency** (like fast.com)
- Supports **connection reuse (keep-alive)** for accurate steady-state latency
- Targets **IP addresses directly** to avoid DNS overhead

---

## 🚀 Installation

1. **Clone the repository:**

```bash
git clone https://github.com/proxyreport/pingwithproxy.git
cd pingwithproxy
```

2. **Install dependencies:**

```bash
npm install
```

> **Supported Node.js version:**  
Requires **Node.js 18+**.  
For best results, **Node.js 20+** is recommended.

---

## ⚙️ Configuration

Edit the **`ping.js`** file to configure:

```js
const proxy = 'http://username:password@proxy.com:port';  // Proxy URL
const target = 'http://130.136.1.142';                         // Target IP (avoid DNS)
const rounds = 10;                                                // Number of pings
const concurrency = 5;                                            // Parallel requests
```

- **Proxy:** Supports HTTP(S) proxies with or without authentication.
- **Target:** Use **IP addresses** (e.g., Google’s `216.58.212.238`) to skip DNS lookups.
- **Rounds:** Total number of pings.
- **Concurrency:** Number of parallel pings (default: 1).

---

## 🏃 Usage

Run the latency tester:

```bash
node ping.js
```

Example output:

```
[✓] Ping 1 → 148.0 ms
[✓] Ping 2 → 147.0 ms
...

=== Latency Stats ===
Total: 15, Success: 15, Failures: 0
Min: 145.0 ms
Avg: 150.3 ms
Median: 149.0 ms
Max: 158.0 ms
```

---

## 🛠️ Features

- **Precise latency measurement**: Uses **time-to-first-byte (TTFB)** for accurate results.
- **High-resolution timers**: Nanosecond accuracy with `process.hrtime.bigint()`.
- **TCP optimizations**: Disables **Nagle's algorithm** (`TCP_NODELAY`) to reduce packet delay.
- **Connection reuse**: Uses **keep-alive** for steady-state latency measurements.
- **Parallel execution**: Configurable **concurrency** for faster tests.

---

## 🤝 Contributing

Contributions are welcome!  
Feel free to submit **issues**, **feature requests**, or **pull requests**.

