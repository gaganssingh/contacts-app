import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "./App.css";
import Navbar from "./components/Layout/Navbar";
import Home from "./components/Pages/Home";
import About from "./components/Pages/About";
import ContactState from "./context/contact/ContactState";

const App = () => {
   return (
      <ContactState>
         <Router>
            <React.Fragment>
               <Navbar />
               <div className="container">
                  <Switch>
                     <Route exact path="/" component={Home} />
                     <Route exact path="/about" component={About} />
                  </Switch>
               </div>
            </React.Fragment>
         </Router>
      </ContactState>
   );
};

export default App;
