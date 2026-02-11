import Form from "./components/Form";
import "./App.css";

function App() {
  const handleSubmit = async (data: any) => {
    try {
      const res = await fetch("http://localhost:3000/insert-customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      console.log(result);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const showCustomers = async () => {
    const res = await fetch("http://localhost:3000/customers");
    const data = await res.json();
    console.log(data);
  };

  return (
    <div style={{ padding: "40px" }}>
      <Form buttonText="Submit" onSubmit={handleSubmit} />
      <button onClick={showCustomers}>Show All Customers</button>
    </div>
  );
}

export default App;
