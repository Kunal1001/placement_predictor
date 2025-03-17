import DataForm from "@/components/DataForm"

export default function Home() {
  return (
    <div>
        <h1 className="text-7xl text-center m-10">
          Placement Probability Calulator
        </h1>
        <h2 className="text-center">
          Enter your details
        </h2>
        <DataForm />
      </div>
  );
}
