import Link from "next/link";

export default function HomeButton() {
  return (
    <Link href="/">
      <button className="px-4 py-2 bg-blue-600 text-white rounded">
        Home
      </button>
    </Link>
  );
}