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
        <li>2️⃣ setup mui in next js <Link href="https://blog.logrocket.com/getting-started-mui-next-js/"> <u>Next+MUI</u> </Link> </li>
      </ol>
      <ol>
        <li>3️⃣next js <a href="https://nextjs.org/learn/dashboard-app/creating-layouts-and-pages"> <u>Learn Next Pages routes</u> </a> </li>
      </ol>
      <ol>
        <li>4️⃣connect postgress database <Link rel="stylesheet" href="https://nextjs.org/learn/dashboard-app/setting-up-your-database" ><u> /setting-up-your-database</u></Link></li>
        <li>5️⃣ learn postgress database <Link rel="stylesheet" href="https://www.w3schools.com/postgresql/" ><u> w3schools.com/postgresql</u></Link></li>
      </ol>
      <ol><li>
        6️⃣ Redux api call - <Link href={'https://medium.com/how-to-react/how-to-use-redux-in-your-react-app-with-axios-2327f581bf8a'}></Link>
      </li></ol>
    </div>
  );
}
