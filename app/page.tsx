import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-gray-900 p-6">
      {/* Header Section */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-red-600 mb-2">Sudhir Kumar</h1>
        <p className="text-xl text-gray-500">Senior Full Stack Developer</p>
        <p className="text-md text-gray-600 mt-2">
          Passionate about building scalable and high-performance applications.
          Expertise in full-stack development, cloud architecture, and
          microservices.
        </p>
      </header>

      {/* Summary Section */}
      <section className="w-full max-w-4xl mb-16 p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Summary</h2>
        <p className="text-lg text-gray-700">
          With over 6 years of experience in full-stack development, I
          specialize in building robust and scalable applications using modern
          technologies. My expertise spans across frontend and backend
          technologies such as React.js, Node.js, PostgreSQL, and AWS. I have a
          strong passion for microservices architecture,microfrontend
          architecture, cloud computing, and developing high-performance
          solutions.
        </p>
      </section>

      {/* Skills Section */}
      <section className="w-full max-w-4xl mb-16 p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Technical Skills</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold">Frontend</h3>
            <ul className="list-disc pl-5">
              <li>React.js</li>
              <li>Next.js</li>
              <li>Tailwind CSS</li>
              <li>React Native</li>
              <li>Microfrontends</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Backend</h3>
            <ul className="list-disc pl-5">
              <li>Node.js</li>
              <li>NestJS</li>
              <li>Express.js</li>
              <li>TypeScript</li>
              <li>TypeORM</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Cloud & DevOps</h3>
            <ul className="list-disc pl-5">
              <li>AWS (Lambda, S3, EC2, API Gateway, etc.)</li>
              <li>Docker</li>
              <li>CI/CD (Gitub Action,Jenkins)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Databases</h3>
            <ul className="list-disc pl-5">
              <li>PostgreSQL</li>
              <li>MySQL</li>
              <li>MongoDB</li>
              <li>🌟 SQL 50 Badge on LeetCode</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Security & Testing</h3>
            <ul className="list-disc pl-5">
              <li>Burp Suite (API Security Testing)</li>
              <li>OWASP Best Practices</li>
              <li>Unit & Integration Testing</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Microservices</h3>
            <ul className="list-disc pl-5">
              <li>Redis</li>
              <li>AWS SQS</li>
              <li>MQTT</li>
              <li>Kafka</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="w-full max-w-4xl mb-16 p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Experience</h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">
              Senior Software Engineer | iSpace Software Pvt Ltd
            </h3>
            <p className="text-sm text-gray-500">July 2024 – Present</p>
            <p>
              Lead the full-stack development of enterprise applications,
              integrating Node.js, AWS services, and PostgreSQL for
              high-availability systems. Developed and maintained scalable
              microservices architecture using AWS Lambda, SQS, and API Gateway.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">
              Senior Associate Engineer | Hanriver Technology Pvt Ltd
            </h3>
            <p className="text-sm text-gray-500">Feb 2023 – June 2024</p>
            <p>
              Developed APIs and backend systems using Express.js and MySQL,
              integrating caching with Redis for optimized performance. Ensured
              continuous delivery through Jenkins CI/CD pipelines, and improved
              security through proactive testing with Burp Suite.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">
              Backend Engineer | Aexonic Technologies Pvt Ltd
            </h3>
            <p className="text-sm text-gray-500">Oct 2022 – Jan 2023</p>
            <p>
              Focused on optimizing MongoDB queries, writing efficient
              serverless functions using Node.js, and contributing to internal
              tools. Maintained secure VPN configurations and developed RESTful
              APIs for internal services.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">
              Software Engineer | Workplace Fabric India Ltd
            </h3>
            <p className="text-sm text-gray-500">Jan 2019 – Sep 2022</p>
            <p>
              Worked on enterprise IoT applications, developing progressive web
              apps and dashboards. Implemented JWT authentication and designed
              microservices using AWS Lambda functions to scale business
              solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="w-full max-w-4xl mb-16 p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Selected Projects</h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">
              Engineering Measuring Platform
            </h3>
            <p>
              Developed a platform to track and measure key engineering metrics
              in real-time, optimizing backend performance and API response
              times.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Enterprise IoT Dashboard</h3>
            <p>
              Built a real-time monitoring dashboard for enterprise IoT devices
              using Node.js, React, and AWS IoT services to track device status
              and metrics.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">
              Custom API Solutions for Enterprises
            </h3>
            <p>
              Designed and implemented custom API solutions for enterprise
              clients, focusing on security, performance optimizations, and
              scalability.
            </p>
          </div>
        </div>
      </section>
      {/* Education Section */}
      <section className="w-full max-w-4xl mb-16 p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Education</h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">
              Master in Computer Application
            </h3>
            <p className="text-sm text-gray-500">
              National Insititute of Technology , Jamshedpur | 2016 – 2019
            </p>
            <p>
              Completed coursework in software engineering, algorithms,
              databases, and cloud computing. Actively participated in
              hackathons and software development competitions, securing
              positions.
            </p>
          </div>
        </div>
      </section>
      {/* Certifications Section */}
      <section className="w-full max-w-4xl mb-16 p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Certifications</h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">
              AWS Certified Solutions Architect
            </h3>
            <p className="text-sm text-gray-500">Edureka | May 2024</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">
              Master in DSA & System Design
            </h3>
            <p className="text-sm text-gray-500">HeyCoach | March 2024</p>
          </div>
        </div>
      </section>
      {/* Achievements Section */}
      <section className="w-full max-w-4xl mb-16 p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Achievements</h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">SQL 50 Badge on LeetCode</h3>
            <p className="text-sm text-gray-500">LeetCode | November 2024</p>
            <p>
              Earned the prestigious SQL 50 badge on LeetCode, recognizing my
              dedication and expertise in working with databases. This
              achievement reflects my strong foundation in SQL, which I
              regularly apply in backend development and data engineering. I&apos;m
              excited to continue honing my database skills and leverage them in
              new and challenging projects.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <footer className="text-center mt-12 mb-4">
        <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
        <p>
          You can reach out to me via phone at{" "}
          <span className="text-red-600">+91 9304513277</span> or email at{" "}
          <a
            href="mailto:strr7452@gmail.com"
            className="text-blue-500 hover:text-blue-700"
          >
            strr7452@gmail.com
          </a>{" "}
          or connect with me on{" "}
          <a
            href="https://www.linkedin.com/in/sudhirkumar-in"
            className="text-blue-500 hover:text-blue-700"
          >
            LinkedIn
          </a>
          . I&apos;m always open to new opportunities and collaborations!
        </p>
        <p className="mt-4 text-gray-600">
          🌟 Recently earned the SQL 50 badge on LeetCode, highlighting my
          proficiency in database management and SQL queries.
        </p>
        <div className="mt-4">
          <a
            href="https://github.com/gitsudhir"
            className="text-blue-500 hover:text-blue-700 mx-4"
          >
            GitHub
          </a>
          <a
            href="https://leetcode.com/u/sudhirkumar-in/"
            className="text-blue-500 hover:text-blue-700 mx-4"
          >
            LeetCode
          </a>
        </div>
      </footer>
    </main>
  );
}
