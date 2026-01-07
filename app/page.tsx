import Image from "next/image";
import Link from "next/link";
import CopyButton from "../components/CopyButton";

export const metadata = {
  title: "Sudhir Kumar | Lead Rust Developer & Payment Systems Expert",
  description: "Backend-focused Senior Software Engineer specializing in high-performance payment systems using Rust. Expertise in distributed systems, cloud architecture, and scalable backend solutions.",
  keywords: "Rust Developer, Payment Systems, Backend Engineer, Distributed Systems, Cloud Architecture, Kubernetes, Docker, AWS, PostgreSQL, MongoDB",
  authors: [{ name: "Sudhir Kumar" }],
  openGraph: {
    title: "Sudhir Kumar | Lead Rust Developer & Payment Systems Expert",
    description: "Backend-focused Senior Software Engineer specializing in high-performance payment systems using Rust.",
    type: "website",
    locale: "en_US",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-16">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <Image
                src="/profile-picture.png"
                alt="Sudhir Kumar"
                width={200}
                height={200}
                className="rounded-full object-cover border-2 border-white shadow-xl"
                priority
              />

            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Sudhir Kumar
          </h1>
          <h2 className="text-xl md:text-2xl text-gray-600 mb-6">
            Lead Developer - Rust Backend Engineer
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Backend-focused Senior Software Engineer specializing in high-performance payment systems using Rust.
            Expertise in distributed systems, cloud architecture, and scalable backend solutions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:strr7452@gmail.com"
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium rounded-full hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Get In Touch
            </a>
            <a
              href="https://leetcode.com/u/sudhirkumar-in/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium rounded-full hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              LeetCode
            </a>
            <a
              href="/clipboard-rs_0.1.0_aarch64_v2.dmg"
              download
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-full hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Download Clipboard App (Mac)
            </a>
            <a
              href="https://www.linkedin.com/in/sudhirkumar-in"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white text-gray-900 font-medium rounded-full border border-gray-300 hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/gitsudhir"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white text-gray-900 font-medium rounded-full border border-gray-300 hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Summary Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">About Me</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto"></div>
          </div>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 leading-relaxed">
              Backend-focused Senior Software Engineer with extensive experience in building high-performance,
              scalable applications using Rust, Node.js, and modern backend technologies. Currently leading
              development efforts on a payment orchestration system at Gazoole Technologies. Specialized in
              distributed systems, cloud infrastructure, payment processing, and scalable backend solutions.
              Strong expertise in Rust programming with a focus on modular, asynchronous architecture for
              financial systems.
            </p>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Technical Skills</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Programming Languages</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  <span className="text-gray-700">Rust</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  <span className="text-gray-700">JavaScript</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  <span className="text-gray-700">TypeScript</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  <span className="text-gray-700">Node.js</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Frameworks & Libraries</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  <span className="text-gray-700">Express.js</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  <span className="text-gray-700">Nest.js</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  <span className="text-gray-700">Axum</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  <span className="text-gray-700">Tokio</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Databases</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  <span className="text-gray-700">PostgreSQL</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  <span className="text-gray-700">MongoDB</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  <span className="text-gray-700">MySQL</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Cloud & DevOps</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  <span className="text-gray-700">AWS (EC2, S3, CloudFront)</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  <span className="text-gray-700">Docker</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  <span className="text-gray-700">Kubernetes</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  <span className="text-gray-700">CI/CD Pipelines</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Architecture & Tools</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  <span className="text-gray-700">Microservices</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  <span className="text-gray-700">System Design</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  <span className="text-gray-700">Git & Version Control</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  <span className="text-gray-700">Datadog Monitoring</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Specialized Areas</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  <span className="text-gray-700">Payment Orchestration</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  <span className="text-gray-700">Scalable Architecture</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  <span className="text-gray-700">Data Structures & Algorithms</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  <span className="text-gray-700">Test-Driven Development</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Experience</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto"></div>
          </div>
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="relative pl-8 border-l-2 border-gray-200">
              <div className="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-red-500"></div>
              <div className="mb-1">
                <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-orange-500 rounded-full">
                  June 2025 - Present
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Lead Developer</h3>
              <p className="text-lg text-gray-600 mb-3">Gazoole Technologies Pvt. Ltd</p>
              <p className="text-gray-700">
                Working on a payment orchestration system for AtlPay. Developing and integrating new payment and
                payout connectors within the Hyperswitch framework, using Rust with an emphasis on modular,
                asynchronous architecture. Handling connector configuration, request/response flows, authentication
                mechanisms, error handling, and ensuring compliance with third-party processor APIs. Deployed the
                system on AWS EC2 instances, containerized with Docker, and orchestrated using Kubernetes.
                Monitoring system performance and container health using Datadog Agent deployed as a Kubernetes
                DaemonSet. Working closely with DevOps and QA to ensure high availability, observability, and
                fault tolerance in payment workflows.
              </p>
            </div>
            <div className="relative pl-8 border-l-2 border-gray-200">
              <div className="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-red-500"></div>
              <div className="mb-1">
                <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-orange-500 rounded-full">
                  July 2024 - May 2025
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Senior Software Engineer</h3>
              <p className="text-lg text-gray-600 mb-3">iSpace Software Solutions India Pvt. Ltd</p>
              <p className="text-gray-700">
                Led backend development efforts in creating and optimizing scalable applications using Node.js and
                Express.js. Mentored junior developers, improving team productivity by guiding best practices in
                Node.js and database management. Designed and optimized database schemas for high-traffic
                applications, utilizing PostgreSQL and MongoDB.
              </p>
            </div>
            <div className="relative pl-8 border-l-2 border-gray-200">
              <div className="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-red-500"></div>
              <div className="mb-1">
                <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-orange-500 rounded-full">
                  Feb 2023 - Jun 2024
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Senior Associate Engineer</h3>
              <p className="text-lg text-gray-600 mb-3">HanRiver Technology</p>
              <p className="text-gray-700">
                Developed backend solutions with a focus on scalability and efficiency, contributing to complex
                engineering projects. Optimized data processing pipelines for large-scale data, improving system
                throughput. Built fault-tolerant services using microservices architecture and system design principles.
              </p>
            </div>
            <div className="relative pl-8 border-l-2 border-gray-200">
              <div className="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-red-500"></div>
              <div className="mb-1">
                <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-orange-500 rounded-full">
                  Oct 2022 - Jan 2023
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Backend Engineer</h3>
              <p className="text-lg text-gray-600 mb-3">Aexonic Technologies</p>
              <p className="text-gray-700">
                Improved backend performance using efficient data structures and optimized algorithms. Delivered
                scalable product features via microservices development. Maintained code quality through unit tests
                and code reviews.
              </p>
            </div>
            <div className="relative pl-8 border-l-2 border-gray-200">
              <div className="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-red-500"></div>
              <div className="mb-1">
                <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-orange-500 rounded-full">
                  Jan 2019 - Sep 2022
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Software Engineer</h3>
              <p className="text-lg text-gray-600 mb-3">WorkPlace Fabric India Pvt. Ltd</p>
              <p className="text-gray-700">
                Built APIs and server-side features in Node.js, increasing business efficiency by 40%. Used AWS
                CloudFront to reduce page load times by 70%.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Selected Projects</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Payment Orchestration System (Hyperswitch Framework)</h3>
                <p className="text-gray-700 mb-4">
                  Leading development of a payment orchestration system for AtlPay using the Hyperswitch framework.
                  Building and integrating new payment and payout connectors with Rust, focusing on modular,
                  asynchronous architecture.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-medium rounded-full">Rust</span>
                  <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-medium rounded-full">AWS</span>
                  <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-medium rounded-full">Kubernetes</span>
                  <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-medium rounded-full">Docker</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Cloud-Native Deployment & Monitoring</h3>
                <p className="text-gray-700 mb-4">
                  Deployed payment systems on AWS EC2 instances with Docker containerization and Kubernetes orchestration.
                  Implemented comprehensive monitoring using Datadog Agent as a Kubernetes DaemonSet.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-medium rounded-full">AWS</span>
                  <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-medium rounded-full">Kubernetes</span>
                  <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-medium rounded-full">Datadog</span>
                  <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-medium rounded-full">DevOps</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">High-Performance Backend Systems</h3>
                <p className="text-gray-700 mb-4">
                  Developed scalable backend solutions with a focus on performance and efficiency. Optimized data
                  processing pipelines for large-scale data operations and built fault-tolerant services.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-medium rounded-full">Node.js</span>
                  <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-medium rounded-full">PostgreSQL</span>
                  <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-medium rounded-full">MongoDB</span>
                  <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-medium rounded-full">Microservices</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Open Source Contributions</h3>
                <p className="text-gray-700 mb-4">
                  Contributed to the ByteByteGo System Design Community with code and improvements to educational
                  materials. Actively contributed to the &#34;Coding Interview Patterns&#34; book project with Rust code samples.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-medium rounded-full">Rust</span>
                  <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-medium rounded-full">Open Source</span>
                  <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-medium rounded-full">Education</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IoT & Embedded Systems Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">IoT & Embedded Systems</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto"></div>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8 shadow-sm">
              <p className="text-lg text-gray-700 mb-6">
                In my spare time, I explore embedded systems programming with Rust on ESP32 microcontrollers.
                This hobby allows me to leverage Rust&#39;s memory safety and performance benefits in resource-constrained
                environments while building innovative IoT solutions.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">ESP32 IoT Projects</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      <span>WiFi-enabled ultrasonic sensor systems with LED matrix displays</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      <span>Bluetooth Low Energy (BLE) services and communication protocols</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      <span>Asynchronous counter implementations with real-time monitoring</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Technical Focus</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      <span>Happy birthday melody player using buzzers and audio generation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      <span>Matrix display controllers with API integration capabilities</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      <span>Exploring Rust&#39;s zero-cost abstractions and ownership model</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Certifications</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto"></div>
          </div>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Master in Data Structures & Algorithms and System Design</h3>
              <p className="text-gray-600 mb-2">HeyCoach</p>
              <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-orange-500 rounded-full">
                Oct 2024 - Mar 2025 (Ongoing)
              </span>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-2">AWS Certified Solutions Architect</h3>
              <p className="text-gray-600 mb-2">Edureka</p>
              <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-orange-500 rounded-full">
                May 2024
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Clipboard App Section */}
      <section id="clipboard" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Clipboard History Manager</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A lightweight macOS application that keeps track of your clipboard history for easy access.
            </p>
          </div>
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Download for macOS</h3>
                  <p className="text-gray-700 mb-4">
                    Keep track of everything you copy to your clipboard with our easy-to-use macOS app. 
                    Access your clipboard history anytime with a simple keyboard shortcut.
                  </p>
                  <ul className="text-gray-700 space-y-2 mb-6">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Track clipboard history automatically
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Quick access with keyboard shortcuts
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Lightweight and efficient
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col items-center">
                  <a
                    href="/clipboard-rs_0.1.0_aarch64_v2.dmg"
                    download
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-full hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Download for macOS
                  </a>
                  <p className="mt-4 text-sm text-gray-500">
                    Version 0.1.0 • Apple Silicon (M1/M2/M3)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* AIEdit (Linux) Section */}
      <section id="aiedit" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">AIEdit for Linux</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A powerful Tauri-based application for Linux systems with advanced editing capabilities.
            </p>
          </div>
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Install on Ubuntu/Debian</h3>
                  <p className="text-gray-700 mb-4">
                    Easily install AIEdit on your Linux system with our one-command installer. 
                    Built with Rust for maximum performance and reliability.
                  </p>
                  <ul className="text-gray-700 space-y-2 mb-6">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      One-command installation
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Lightweight and fast
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Built with Rust for security and performance
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-gray-800 text-green-400 text-sm p-4 rounded-lg font-mono mb-4 flex items-center justify-between w-full">
                    <div>curl -fsSL https://sudhirkumar.in/linux/install.sh | sudo bash</div>
                    <CopyButton text="curl -fsSL https://sudhirkumar.in/linux/install.sh | sudo bash" />
                  </div>
                  <a 
                    href="/linux/aiedit_0.1.1_amd64.deb" 
                    download
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-full hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Download .deb File
                  </a>
                  <p className="mt-4 text-sm text-gray-500">
                    Version 0.1.1 • AMD64
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Let&#39;s Connect</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            I&#39;m always open to new opportunities, collaborations, and interesting conversations about technology.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:strr7452@gmail.com"
              className="px-6 py-3 bg-white text-gray-900 font-medium rounded-full hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Email Me
            </a>
            <a
              href="https://www.linkedin.com/in/sudhirkumar-in"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-transparent text-white font-medium rounded-full border border-white hover:bg-white hover:text-gray-900 transition-all duration-300"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/gitsudhir"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-transparent text-white font-medium rounded-full border border-white hover:bg-white hover:text-gray-900 transition-all duration-300"
            >
              GitHub
            </a>
            <a
              href="https://leetcode.com/u/sudhirkumar-in/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-transparent text-white font-medium rounded-full border border-white hover:bg-white hover:text-gray-900 transition-all duration-300"
            >
              LeetCode
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-900 text-gray-400 text-center">
        <div className="max-w-7xl mx-auto">
          <p>© {new Date().getFullYear()} Sudhir Kumar. All rights reserved.</p>
          <p className="mt-2 text-sm">Built with Next.js and deployed on Vercel</p>
        </div>
      </footer>
    </main>
  );
}