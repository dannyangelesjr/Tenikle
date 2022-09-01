(function () {
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
                node: document.getElementById('product-component-1660181892298'),
                moneyFormat: '%24%7B%7Bamount%7D%7D',
                options: {
                    "product": {
                        "styles": {
                            "product": {
                                "@media (min-width: 601px)": {
                                    "max-width": "calc(25% - 20px)",
                                    "margin-left": "20px",
                                    "margin-bottom": "50px"
                                }
                            },
                            "button": {
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
                                "padding-left": "87px",
                                "padding-right": "87px"
                            },
                            "quantityInput": {
                                "font-size": "18px",
                                "padding-top": "17px",
                                "padding-bottom": "17px"
                            }
                        },
                        "contents": {
                            "img": false,
                            "title": false,
                            "price": false
                        },
                        "text": {
                            "button": "Add to cart"
                        },
                        "googleFonts": [
                            "Montserrat"
                        ],
                        DOMEvents: {
                            'click .shopify-buy__btn': function (evt, target) {
                              let data = target;
                              let product = ui.components;
                
                              updateCart(product.product[0].model.id, product.product[0].selectedVariant.id, product.product[0].selectedQuantity);
                
                              setupModal();
                
                              const iframeDocument = document.getElementById('myIframe');
                              const iframeWindow = iframeDocument.contentWindow;
                              iframeDocument.style.display = "block";
                            }
                          },
                    },
                    "productSet": {
                        "styles": {
                            "products": {
                                "@media (min-width: 601px)": {
                                    "margin-left": "-20px"
                                }
                            }
                        }
                    },
                    "modalProduct": {
                        "contents": {
                            "img": false,
                            "imgWithCarousel": true,
                            "button": false,
                            "buttonWithQuantity": true
                        },
                        "styles": {
                            "product": {
                                "@media (min-width: 601px)": {
                                    "max-width": "100%",
                                    "margin-left": "0px",
                                    "margin-bottom": "0px"
                                }
                            },
                            "button": {
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
                                "padding-left": "87px",
                                "padding-right": "87px"
                            },
                            "quantityInput": {
                                "font-size": "18px",
                                "padding-top": "17px",
                                "padding-bottom": "17px"
                            }
                        },
                        "googleFonts": [
                            "Montserrat"
                        ],
                        "text": {
                            "button": "Add to cart"
                        }
                    },
                    "option": {
                        "styles": {
                            "label": {
                                "font-family": "Montserrat, sans-serif"
                            },
                            "select": {
                                "font-family": "Montserrat, sans-serif"
                            }
                        },
                        "googleFonts": [
                            "Montserrat"
                        ]
                    },
                    "cart": {
                        "styles": {
                            "button": {
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
                        "text": {
                            "total": "Subtotal",
                            "button": "Checkout"
                        },
                        "contents": {
                            "note": true
                        },
                        "popup": false,
                        "googleFonts": [
                            "Montserrat"
                        ]
                    },
                    "toggle": {
                        "styles": {
                            "toggle": {
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
                            "count": {
                                "font-size": "18px"
                            }
                        },
                        "googleFonts": [
                            "Montserrat"
                        ]
                    }
                },
            });
        });
    }
})();