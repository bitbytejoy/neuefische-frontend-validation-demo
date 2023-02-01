import React, {ChangeEvent, useCallback} from 'react';
import './App.css';
import axios, {AxiosError} from "axios";

function App() {
  const [brand, setBrand] = React.useState("");
  const [model, setModel] = React.useState("");
  const [year, setYear] = React.useState(2000);
  const [color, setColor] = React.useState("");
  const [errors, setErrors] = React.useState<{[key: string]: string}>({});

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;

    switch (name) {
      case "brand":
        setErrors(prev => {
          let errors = {...prev, brand: "Brand is required"};
          if (value.length > 0) {
            delete (errors as any).brand;
          }
          return errors;
        });
        setBrand(value);
        break;
      case "model":
        setModel(value);
        break;
      case "year":
        setYear(parseInt(value));
        break;
      case "color":
        setColor(value);
        break;
    }
  }, []);

  const onSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    try {
      await axios.post("/api/cars", {
        brand,
        model,
        year,
        color
      });
    } catch (e: any|AxiosError) {
      setErrors(e.response.data);
    }
  }, [brand, model, year, color]);

  return (
    <div className="App">
      {!!Object.keys(errors).length && <pre>{JSON.stringify(errors, null, 2)}</pre>}

      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="brand">Brand</label>
          <input type="text" id="brand" name={"brand"} value={brand} onChange={onChange}/>
        </div>

        <div>
          <label htmlFor="model">Model</label>
          <input type="text" id="model" name={"model"} value={model} onChange={onChange}/>
        </div>

        <div>
          <label htmlFor="year">Year</label>
          <input type="number" id="year" value={year} onChange={onChange}/>
        </div>

        <div>
          <label htmlFor="color">Color</label>
          <input type="text" id="color" name={"color"} value={color} onChange={onChange} />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
