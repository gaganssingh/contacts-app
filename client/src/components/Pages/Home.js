import React from "react";
import Contacts from "../Contacts/Contacts";
import ContactForm from "../Contacts/ContactForm";

const Home = () => {
   return (
      <div className="grid-two">
         <div>
            <ContactForm />
         </div>
         <div>
            <Contacts />
         </div>
      </div>
   );
};

export default Home;
