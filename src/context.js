import React, { Component } from "react";
import { fetchProducts } from "./apiRequests/ProductsReq";
import {
  addToCart,
  clearCartReq,
  getCartItems,
  removeCartItem,
  incrementCartItem,
  decrementCartItem,
} from "./apiRequests/cartReq";
import apiClient from "./util/axios";
const ProductContext = React.createContext();

class ProductProvider extends Component {
  state = {
    totalPages: 1,
    totalItems: 0,
    currentPage: 1,
    filteredProducts: [],
    products: [],
    detailProduct: {},
    messageModalOpen: false,
    messageModalText: "",
    cart: [],
    modalOpen: false,
    modalProduct: null,
    showLoginModal: false,
    cartSubTotal: 0,
    pendingProductId: null,
    isLoggedIn: false,
    cartShipping: 0,
    cartTotal: 0,
    selectedBrandIds: [],
    minPrice: 0,
    maxPrice: 10000,
    currentPrice: this.maxPrice,
    sortBy: "default",
  };

  componentDidMount() {
    this.setProducts(1); // Fetch first page of products on mount
    apiClient
      .get("/authuser", { withCredentials: true })
      .then((res) => {
        this.setState({ isLoggedIn: res.data.isLoggedIn });
      })
      .catch(() => {
        this.setState({ isLoggedIn: false });
      });
  }
  resetFilters = () => {
    // 1. Reset filter states to initial defaults
    this.setState(
      {
        selectedBrandIds: [],
        // Reset prices to the initial min/max range for the database
        minPrice: 0,
        maxPrice: sessionStorage.getItem("maxPrice"),
        // Reset the slider's current value to the maximum (10000)
        currentPrice: sessionStorage.getItem("maxPrice"),
        sortBy: "default",
        // Reset sorting if you had implemented it
        // sortBy: 'default',
      },
      () => {
        // 2. Fetch products using the reset state, starting at page 1
        this.setProducts(1);
      }
    );
  };

  setSortBy = (value) => {
    this.setState({ sortBy: value });
  };

  setFilter = (type, value, isChecked) => {
    if (type === "brand") {
      this.setState((prevState) => {
        const newBrandIds = isChecked
          ? [...prevState.selectedBrandIds, value]
          : prevState.selectedBrandIds.filter((id) => id !== value);
        return { selectedBrandIds: newBrandIds };
      });
    } // Note: The price slider is handled by setCurrentPrice, so we don't need a case for it here.
  };

  applyFilters = () => {
    // When the user clicks "Apply", we treat this as a new search
    // and must refresh the products starting at the first page (1).
    this.setProducts(1);
  };

  setCurrentPrice = (price) => {
    this.setState({ currentPrice: price });
  };

  setSelectedBrandIds = (brandIds) => {
    // When brands change, update state and fetch products from page 1
    this.setState({ selectedBrandIds: brandIds });
  };

  setMinPrice = (minPrice) => {
    this.setState({ minPrice });
  };

  setMaxPrice = (maxPrice) => {
    this.setState({ maxPrice });
  };
  fetchCart = async () => {
    try {
      const result = await getCartItems();
      if (result && result.cart) {
        this.setState({ cart: result.cart }, this.addTotals);
        this.forceUpdate();
      } else {
        this.setState({ cart: [] }, this.addTotals);
        // Only show error if there is a real error, not just empty cart
        if (
          result?.error &&
          result?.code !== "NOT_LOGGED_IN" &&
          result?.code !== "MISSING_AUTH_HEADER" &&
          result?.code !== "INVALID_OR_EXPIRED_TOKEN"
        ) {
          this.openMessageModal(result?.error || "Failed to fetch cart");
        }
        // If no error, do NOT show the modal (cart is just empty)
      }
    } catch (error) {
      const code =
        error?.response?.data?.code || error?.code || error?.data?.code;
      if (
        code !== "NOT_LOGGED_IN" &&
        code !== "MISSING_AUTH_HEADER" &&
        code !== "INVALID_OR_EXPIRED_TOKEN"
      ) {
        this.openMessageModal(error?.message || "Failed to fetch cart");
      }
      this.setState({ cart: [] }, this.addTotals);
    }
  };
  openMessageModal = (msg) => {
    this.setState({
      messageModalOpen: true,
      messageModalText: msg,
    });
  };

  closeMessageModal = () => {
    this.setState({ messageModalOpen: false, messageModalText: "" });
  };

  //this function is used to
  // 1- take the value comming from the search input "navbar" and
  // 2- filters for this data
  // 3- updates the state with the filtered products
  // 4- product list choose what to render filtered product if there is or products

  openLoginModal = (productId) => {
    this.setState({
      showLoginModal: true,
      modalOpen: false,
      pendingProductId: productId,
    });
  };
  closeLoginModal = () => {
    this.setState({ showLoginModal: false });
  };
  filterProducts = (value) => {
    value = value.toLowerCase();
    if (!value) {
      // reset to all products after searching is done
      this.setState({ filteredProducts: [] });
      return;
    }

    let products = [];
    this.state.products.forEach((item) => {
      if (
        item.title.toLowerCase().includes(value) ||
        item.info.toLowerCase().includes(value)
      ) {
        const singleItem = { ...item };
        products = [...products, singleItem];
      }
    });
    this.setState(() => {
      return { filteredProducts: products };
    }, this.checkCartItems);
  };

  setProducts = async (pageNumber) => {
    const pageSize = 12; // Number of products per page
    const { minPrice, currentPrice, selectedBrandIds, sortBy } = this.state;

    try {
      const res = await fetchProducts(
        pageNumber,
        pageSize,
        minPrice,
        currentPrice,
        selectedBrandIds,
        sortBy
      );
      this.setState(
        {
          products: res.products,
          message: res.message,
          error: "",
          totalPages: res.totalPages,
          totalItems: res.totalProducts,
          currentPage: pageNumber,
        },
        this.checkCartItems
      );
    } catch (err) {
      console.error(err.error || "Failed to fetch products");
      this.setState({ error: err.error || "Something went wrong" });
      alert(`Error: ${err.error || "Something went wrong"}`);
    }
  };

  setPage = (pageNumber) => {
    if (pageNumber < 1) pageNumber = 1;
    this.setProducts(pageNumber);
  };

  //=================================================================================
  //! this is this is the normal function to set products from the database
  //!issues for lagrge data sets it gets overhilming and slow
  //* solution is to use pagination and load more products on scroll or button click
  //fetch all products fron the data base using fetchoproducts request from api request
  // setProducts = async () => {
  //   try {
  //     const res = await fetchProducts();
  //     this.setState(
  //       { products: res.products, message: res.message, error: "" },
  //       this.checkCartItems
  //     );
  //   } catch (err) {
  //     console.error(err.error || "Failed to fetch products");
  //     this.setState({ error: err.error || "Something went wrong" });
  //     alert(`Error: ${err.error || "Something went wrong"}`);
  //   }
  // };
  //=================================================================================

  setIsLoggedIn = (value) => {
    this.setState({ isLoggedIn: value });
  };

  //search for product for products from the current state
  getItem = (id) => {
    const product = this.state.products.find((item) => item.id === id);
    // console.log(product);
    return product;
  };

  handleDetail = (id) => {
    const product = this.getItem(id);
    this.setState(() => {
      //   console.log("Detail product:", product);
      return { detailProduct: product };
    });
  };
  addToCart = async (productId, quantity = 1) => {
    try {
      const result = await addToCart(productId, quantity);
      if (result && result.success) {
        // User is logged in, show the normal modal
        await this.fetchCart(); // Refresh cart items
        this.openModal(productId); // Open the product modal after adding to cart
      } else {
        // Some other error
        this.setState({ error: result?.error || "Something went wrong" });
        alert(`Error: ${result?.error || "Something went wrong"}`);
      }
    } catch (error) {
      const code = error?.response?.data?.code || error?.code;
      if (
        code === "NOT_LOGGED_IN" ||
        code === "MISSING_AUTH_HEADER" ||
        code === "INVALID_OR_EXPIRED_TOKEN"
      ) {
        // User is not logged in, show only the login modal
        this.openLoginModal(productId);
        return;
      }
      // Other errors
      this.setState({ error: "Request failed" });
      alert("Request failed");
    }
  };

  openModal = (id) => {
    const product = this.getItem(id);
    this.setState({
      modalProduct: product,
      modalOpen: true,
    });
  };

  closeModal = () => {
    this.setState(() => {
      return { modalOpen: false };
    });
  };

  increment = async (id) => {
    const result = await incrementCartItem(id);
    // console.log("Increment response in context:", result);
    if (result && result.success) {
      this.fetchCart(); // Refresh cart items
    } else {
      this.openMessageModal(result?.error || "Something went wrong");
      alert(`Error: ${result?.error || "Something went wrong"}`);
    }
  };

  decrement = async (id) => {
    const result = await decrementCartItem(id);
    // console.log("Decrement response in context:", result);
    if (result && result.success) {
      this.fetchCart(); // Refresh cart items
    } else {
      this.openMessageModal(result?.error || "Something went wrong");
      alert(`Error: ${result?.error || "Something went wrong"}`);
    }
  };

  getTotals = () => {
    let subTotal = 0;
    this.state.cart.forEach((item) => {
      subTotal += item.priceAtAdd * item.quantity;
    });
    const shipping = this.state.cart.length > 0 ? 150 : 0; // 150 EGP shipping if cart not empty
    const total = subTotal + shipping;
    return { subTotal, shipping, total };
  };

  addTotals = () => {
    const totals = this.getTotals();
    this.setState(() => {
      return {
        cartSubTotal: totals.subTotal,
        cartShipping: totals.shipping, // or cartTax: totals.tax if using tax
        cartTotal: totals.total,
      };
    });
  };

  removeItem = async (id) => {
    const result = await removeCartItem(id);
    if (result && result.success) {
      this.fetchCart(); // Refresh cart items
    } else {
      this.openMessageModal(result?.error || "Something went wrong");
      alert(`Error: ${result?.error || "Something went wrong"}`);
    }
  };
  clearCart = async () => {
    try {
      const result = await clearCartReq();
      if (result && result.code === "CART_CLEARED") {
        await this.fetchCart(); // Refresh cart items
        // Do NOT show error modal here
      } else if (result?.error) {
        this.openMessageModal(result.error);
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      this.openMessageModal(error?.message || "Something went wrong");
      alert(error?.message || "Something went wrong");
    }
  };
  render() {
    return (
      <ProductContext.Provider
        value={{
          ...this.state,
          handleDetail: this.handleDetail,
          addToCart: this.addToCart,
          openModal: this.openModal,
          closeModal: this.closeModal,
          increment: this.increment,
          decrement: this.decrement,
          removeItem: this.removeItem,
          clearCart: this.clearCart,
          openLoginModal: this.openLoginModal,
          closeLoginModal: this.closeLoginModal,
          filterProducts: this.filterProducts,
          isLoggedIn: this.state.isLoggedIn,
          openMessageModal: this.openMessageModal,
          closeMessageModal: this.closeMessageModal,
          setIsLoggedIn: this.setIsLoggedIn,
          checkAuth: this.checkAuth,
          fetchCart: this.fetchCart,
          setPage: this.setPage,
          totalPages: this.state.totalPages,
          totalItems: this.state.totalItems,
          setMinPrice: this.setMinPrice,
          setMaxPrice: this.setMaxPrice,
          setSelectedBrandIds: this.setSelectedBrandIds,
          applyFilters: this.applyFilters,
          setFilter: this.setFilter,
          setCurrentPrice: this.setCurrentPrice,
          resetFilters: this.resetFilters,
          setSortBy: this.setSortBy,
        }}
      >
        {this.props.children}
      </ProductContext.Provider>
    );
  }
}
//the product context is such a box
//product provider controlls what inside the boxes
// means pass all data inside <ProductContext.Provider> to all children which is all inside it

const ProductConsumer = ProductContext.Consumer;

export { ProductProvider, ProductConsumer, ProductContext };
