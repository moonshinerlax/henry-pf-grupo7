import { Protect } from "@clerk/nextjs";
 
export default function admindashboard() {
  return (
    <Protect
      permission="org:admin:admin"
      fallback={<p>You do not have the permissions to access Dashboard.</p>}
    >
      <div>
        <h1>You now have access to dashboard!</h1>
      </div>
    </Protect>
  );
}