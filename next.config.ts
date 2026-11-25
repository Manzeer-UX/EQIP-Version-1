import type { NextConfig } from "next";
import { networkInterfaces } from "node:os";

// This machine's local-network IPv4 addresses, so phones/laptops on the same
// Wi-Fi can open the dev server (e.g. http://10.8.18.128:3100) with live reload.
const lanAddresses = Object.values(networkInterfaces())
  .flat()
  .filter((n) => n && n.family === "IPv4" && !n.internal)
  .map((n) => n!.address);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: lanAddresses,
};

export default nextConfig;
