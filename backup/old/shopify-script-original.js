var scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
if (window.ShopifyBuy) {
    if (window.ShopifyBuy.UI) {
        ShopifyBuyInit();
    } else {
        loadScript();
    }
} else {
    loadScript();
}

// *** start here -> popup modal***
function upsell() {
    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal 
    modal.style.display = "block";

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}
// *** end here ***

function loadScript() {
    var script = document.createElement('script');
    script.async = true;
    script.src = scriptURL;
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
    script.onload = ShopifyBuyInit;
}

function ShopifyBuyInit() {
    var client = ShopifyBuy.buildClient({
        domain: 'tenikle.myshopify.com',
        storefrontAccessToken: 'f4b463a7038ebe9367370e6e50c04b5e',
    });

    ShopifyBuy.UI.onReady(client).then(function (ui) {
        ui.createComponent('product', {
            id: '4958989615190',
            variantId: '33353322397782',
            node: document.getElementById('product-component-1660856442478'),
            moneyFormat: '%24%7B%7Bamount%7D%7D',
            options: {
                product: {
                    // *** start here ->  popup modal ***
                    DOMEvents: {
                        click: function (evt, target) {
                            upsell.call()
                        }
                    },
                    // *** end here ***
                    styles: {
                        product: {
                            "@media (min-width: 601px)": {
                                "max-width": "calc(25% - 20px)",
                                "margin-left": "20px",
                                "margin-bottom": "50px"
                            }
                        },
                        button: {
                            "font-family": "Montserrat, sans-serif",
                            "font-weight": "bold",
                            "font-size": "18px",
                            "padding-top": "17px",
                            "padding-bottom": "17px",
                            ":hover": {
                                "background-color": "#e63844"
                            },
                            "background-color": "#ff3e4b",
                            ":focus": {
                                "background-color": "#e63844"
                            },
                            "border-radius": "15px",
                            "padding-left": "53px",
                            "padding-right": "53px"
                        },
                        quantityInput: {
                            "font-size": "18px",
                            "padding-top": "17px",
                            "padding-bottom": "17px"
                        }
                    },
                    contents: {
                        img: false,
                        button: false,
                        buttonWithQuantity: true,
                        title: false,
                        price: false,
                        options: false
                    },
                    text: {
                        button: "Add to cart"
                    },
                    googleFonts: [
                        "Montserrat"
                    ]
                },
                productSet: {
                    styles: {
                        "products": {
                            "@media (min-width: 601px)": {
                                "margin-left": "-20px"
                            }
                        }
                    }
                },
                "modalProduct": {
                    contents: {
                        img: false,
                        imgWithCarousel: true,
                        button: false,
                        buttonWithQuantity: true
                    },
                    styles: {
                        product: {
                            "@media (min-width: 601px)": {
                                "max-width": "100%",
                                "margin-left": "0px",
                                "margin-bottom": "0px"
                            }
                        },
                        button: {
                            "font-family": "Montserrat, sans-serif",
                            "font-weight": "bold",
                            "font-size": "18px",
                            "padding-top": "17px",
                            "padding-bottom": "17px",
                            ":hover": {
                                "background-color": "#e63844"
                            },
                            "background-color": "#ff3e4b",
                            ":focus": {
                                "background-color": "#e63844"
                            },
                            "border-radius": "15px",
                            "padding-left": "53px",
                            "padding-right": "53px"
                        },
                        quantityInput: {
                            "font-size": "18px",
                            "padding-top": "17px",
                            "padding-bottom": "17px"
                        }
                    },
                    googleFonts: [
                        "Montserrat"
                    ],
                    text: {
                        button: "Add to cart"
                    }
                },
                option: {
                    styles: {
                        "label": {
                            "font-family": "Montserrat, sans-serif"
                        },
                        "select": {
                            "font-family": "Montserrat, sans-serif"
                        }
                    },
                    googleFonts: [
                        "Montserrat"
                    ]
                },
                cart: {
                    styles: {
                        button: {
                            "font-family": "Montserrat, sans-serif",
                            "font-weight": "bold",
                            "font-size": "18px",
                            "padding-top": "17px",
                            "padding-bottom": "17px",
                            ":hover": {
                                "background-color": "#e63844"
                            },
                            "background-color": "#ff3e4b",
                            ":focus": {
                                "background-color": "#e63844"
                            },
                            "border-radius": "15px"
                        }
                    },
                    text: {
                        total: "Subtotal",
                        button: "Checkout"
                    },
                    contents: {
                        note: true
                    },
                    popup: true,
                    googleFonts: [
                        "Montserrat"
                    ]
                },
                toggle: {
                    styles: {
                        toggle: {
                            "font-family": "Montserrat, sans-serif",
                            "font-weight": "bold",
                            "background-color": "#ff3e4b",
                            ":hover": {
                                "background-color": "#e63844"
                            },
                            ":focus": {
                                "background-color": "#e63844"
                            }
                        },
                        count: {
                            "font-size": "18px"
                        }
                    },
                    googleFonts: [
                        "Montserrat"
                    ]
                }
            },
        });
    });
}
