import React from 'react';
import logo from './logo.svg';
import './App.css';
import YFrame from './components/YFrame';

const urls = [
  "http://localhost:3000/1",
  "http://localhost:3000/2",
  "http://localhost:3000/3",
  "http://localhost:3000/4",
]

const fullSize = {
  width: "100vw",
  height: "100vh",
  fontSize: "20px",
  color: "white"
}

const text = "As the consistent sample shows, this looks like a general direction rather than a passing trend. A strong technical basis for convergence is being built, and we may expect the majority of Linux software developed in the upcoming 5 to 10 years to follow these guidelines and core ideas. In this case, unlike in the unsuccessful past examples such as Windows Phone, where different codebases were sold under the same market name with a very limited degree of compatibility, in this case we are already at a point of real convergence, as anyone trying a Linux phone will notice, which we will hope that will end the legacy iPhone-inspired trend of a drastic codebase rewriting for mobile devices, which was initially rather enforced by the enormous performance gap between desktops and mobiles at the time (the first iPhones and Android devices ran on 400MHz, ARM11 CPU, whereas modern ones are comparable to laptops from few years ago) than from deeper philosophical grounds, or technical advantages."

function App() {
  const thing = window.location.pathname.split("/").pop()
  switch (thing) {
    case "1":
      return <div style={{background: "red", ...fullSize}}>{text}</div>
    case "2":
      return <div style={{background: "green", ...fullSize}}>{text}</div>
    case "3":
      return <div style={{background: "blue", ...fullSize}}>{text}</div>
    case "4":
      return <div style={{background: "black", ...fullSize}}>{text}</div>
    default: 
      return (
        <div className="App">
          {urls.map(url => (
            <YFrame src={url} key={url} />
          ))}
        </div>
      );
  }
}

export default App;
