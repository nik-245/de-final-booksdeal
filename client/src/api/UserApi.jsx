import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

const UserApi = (token) => {
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cart, setCart] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (token) {
      const getUser = async () => {
        try {
          const res = await axios.get("http://localhost:5000/user/infor", {
            headers: { Authorization: token },
          });
          setIsLogged(true);
          res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false);

          setCart(res.data.cart);
          // console.log(res);
        } catch (error) {
          alert(error.response.data.msg);
        }
      };
      getUser();
    }
  }, [token]);

  const addCart = async (product) => {
    if (!isLogged) return alert("Login frist");

    const check = cart.every((item) => {
      return item._id !== product._id;
    });

    if (check) {
      setCart([...cart, { ...product, quantity: 1 }]);
      await axios.patch(
        "http://localhost:5000/user/addcart",
        {
          cart: [...cart, { ...product, quantity: 1 }],
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
    } else {
      alert("This product has been add to cart");
    }
  };

  return {
    isLogged: [isLogged, setIsLogged],
    isAdmin: [isAdmin, setIsAdmin],
    cart: [cart, setCart],
    addCart: addCart,
    history: [history, setHistory],
  };
};

export default UserApi;
