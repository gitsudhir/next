import Image from "next/image";
import Link from 'next/link';
export default function Home() {

  return (
    <div>
      <ol>
        <li>1️⃣.Deploy the nextjs application using Vercel . And set the domain (buyed on Godaddy)</li>
        <li><Image alt="image.png" src={'/verceldomain.png'} width={400} height={300}></Image> </li>
      </ol>
      <ol>
        <li>setup mui in next js <Link href="https://blog.logrocket.com/getting-started-mui-next-js/"> <u>Next+MUI</u> </Link> </li>
      </ol>
      <ol>
        <li>next js <a href="https://nextjs.org/learn/dashboard-app/creating-layouts-and-pages"> <u>Learn Next Pages routes</u> </a> </li>
      </ol>
    </div>
  );
}
