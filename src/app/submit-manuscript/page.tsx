import { redirect } from 'next/navigation';

export default function SubmitManuscriptRedirect() {
  redirect('/author/dashboard');
}
