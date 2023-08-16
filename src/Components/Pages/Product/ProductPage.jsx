import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./productpg.css";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import ReviewModal from "./reviewModal";
import ProductReviews from "./ProductReviews";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loginChek, setLoginChek] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState([]);
  const [reviewModal, setReviewModal] = useState(false);
  const [myuser, setMyuser] = useState(null);
  const [mode , setMode] = useState("rating")
  const [editData , setEditData] = useState(null)

  useEffect(() => {
    checkLogin();
  }, []);

  useEffect(() => {
    fetchProduct();
    // fetchRating();
  }, []);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `http://localhost:5000/products/product-with-ratings/${id}`
      );
      setProduct(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const checkLogin = async () => {
    try {
      const response = await axios.get("http://localhost:5000/auth/user", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLoginChek(true);
    } catch (error) {
      setLoginChek(false);
      console.error(error);
    }
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };
  const handleCloseModal2 = () => {
    setShowLoginModal(false);
    window.location.href = "/login";
  };

  const addToCart = (productId) => {
    if (loginChek === false) {
      setShowLoginModal(true);
    } else {
      axios
        .post(
          "http://localhost:5000/cart/cart/add",
          {
            productId: productId,
            quantity: 1,
          },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log(response.data);

          toast.success("Item Added to cart", {
            autoClose: 2000,
            position: "bottom-right",
          });
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <>
      <Dialog
        open={showLoginModal}
        onClose={handleCloseModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"To add a product to the shopping cart, you must log in."}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Proceed to login?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Not yet
          </Button>
          <Button
            onClick={() => {
              handleCloseModal2();
            }}
            color="primary"
            autoFocus
          >
            Yes, proceed
          </Button>
        </DialogActions>
      </Dialog>
      {loading ? (
        <div className="page-loading">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          <div className="productcontainer">
            <div className="product-details">
              <div className="product-image">
                <img src={product.imagePath} alt={product.title} />
              </div>
              <div className="product-info">
                <h2>{product.title}</h2>
                <p>Product ID: {product.productCode}</p>
                <h4>Manufacturer: {product.manufacturer}</h4>
                <h4>
                  Category:{" "}
                  <Link to={`/category/${product.category}`}>
                    {product.category}
                  </Link>
                </h4>
                <p>{product.description}</p>
                <h2 className="item-prices">
                  {product.discountprice !== 0
                    ? `₹ ${product.price}`
                    : `₹ ${product.price}`}
                </h2>
                <h2 className="item-dcprices">
                  {product.discountprice !== 0
                    ? `₹ ${product.discountprice}`
                    : ""}
                </h2>
                <h4 style={{ color: product.quantity > 0 ? "green" : "red" }}>
                  {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                </h4>{" "}
                {product.quantity > 0 ? (
                  <>
                    <button
                      type="button"
                      onClick={() => addToCart(product._id)}
                    >
                      Add to Cart
                    </button>

                    <div>{}</div>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
          <ProductReviews
            product={product}
            setReviewModal={setReviewModal}
            setMode={setMode}
            setEditData={setEditData}
            />
          {reviewModal && (
            <ReviewModal
            isModalOpen={reviewModal}
            setIsModalOpen={setReviewModal}
            productId={product._id}
            mode={mode}
            editData={editData || null}
            />
          )}
        </>
      )}
    </>
  );
};

export default ProductPage;
