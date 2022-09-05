const scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
const shopifyDomain = 'tenikle.myshopify.com';
const shopifyAccessToken = 'f4b463a7038ebe9367370e6e50c04b5e';

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
        domain: shopifyDomain,
        storefrontAccessToken: shopifyAccessToken,
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
                    "DOMEvents": {
                        'click .shopify-buy__btn': function (evt, target) {
                            let data = target;
                            let product = ui.components;
                            updateCart(client, product.product[0].storefrontId, product.product[0].selectedVariant.id, product.product[0].selectedQuantity);

                            // let $iframe = $('#myIframe');
                            // $iframe[0].style.display = "block";
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

function createCart(client) {
    return new Promise((resolve, reject) => {
        client.checkout.create().then(
            (checkout) => {
                let key = shopifyAccessToken + '.' + shopifyDomain + '.checkoutId';
                let value = checkout.id
                localStorage.setItem(key, value);
                console.log('cart created');
                resolve(checkout.id);
            },
            () => { console.log('unable to create cart '); reject(); })
    })
}

function deleteCart() {
    return new Promise((resolve, reject) => {
        let isCartExist = false;
        for (var checkoutId, key, i = 0; i < localStorage.length; ++i) {
            key = localStorage.key(i);
            if (key.match(shopifyDomain + '.checkoutId')) {
                localStorage.removeItem(localStorage.key(i));
                isCartExist = true;
                console.log('cart deleted');
                resolve(checkoutId);
                break;
            }
        }
        if (!isCartExist) { console.log('no cart to delete'); reject(); }
    })
}

function cartExist() {
    return new Promise((resolve, reject) => {
        let isCartExist = false;
        for (var checkoutId, key, i = 0; i < localStorage.length; ++i) {
            key = localStorage.key(i);
            if (key.match(shopifyDomain + '.checkoutId')) {
                checkoutId = localStorage.getItem(key);
                console.log('found cart!');
                isCartExist = true;
                resolve(checkoutId);
                break;
            }
        }
        if (!isCartExist) { console.log('no cart found'); reject(); }
    })
}

function discountExist(client, checkoutId, discountCode) {
    return new Promise((resolve, reject) => {
        client.checkout.fetch(checkoutId).then(
            (checkout) => {
                let isDiscountExist = false;
                if (checkout.discountApplications.length > 0) {
                    checkout.discountApplications.forEach((discountApplication) => {
                        if (discountApplication.discountCode == discountCode) {
                            isDiscountExist = true;
                        }
                    });
                    if (isDiscountExist) { console.log('discount already in cart '); resolve(); }
                    else { console.log('discount not  in cart'); reject(); }
                }
                else { console.log('discount not  in cart'); reject(); }
            },
            () => { console.log('unable to determine if discount exist but should') })
    })
}

function discountEligibility(client, checkoutId, productId) {
    return new Promise((resolve, reject) => {
        discountExist(client, checkoutId).then(
            () => { console.log('discount already applied. no need to re-apply.'); reject(false); },
            () => {
                quantityRuleSatisfied(client, checkoutId, productId).then(
                    () => { console.log('eligible for discount'); resolve(true) },
                    () => { console.log('not eligible for discount since #items is less than 2'); resolve(false); }
                )
            }
        )
    })
}

function applyDiscount(client, checkoutId, discountCode) {
    return new Promise((resolve, reject) => {
        client.checkout.addDiscount(btoa(checkoutId), discountCode).then(
            () => { console.log('applied discount'); resolve(true); },
            () => { console.log('unable to apply discount but should'); reject(); }
        )
    })
}

function clearDiscount(client, checkoutId, discountCode) {
    return new Promise(() => {
        client.checkout.fetch(checkoutId).then(
            (checkout) => {
                checkout.discountApplications.foreach((discountApplication) => {
                    if (discountApplication == discountCode) {
                        client.checkout.removeDiscount(checkoutId).then(
                            () => { console.log('removed discount'); resolve(true); },
                            () => { console.log('unable to remove discount'); reject(); })
                    }
                })
            },
            () => { console.log('unable to fetch checkout but should'); reject(); }
        );
    })
}

function quantityRuleSatisfied(client, checkoutId, productId) {
    return new Promise((resolve, reject) => {
        client.checkout.fetch(checkoutId).then(
            (checkout) => {
                let quantityInCart = 0;
                checkout.lineItems.forEach((lineItem) => {
                    if (lineItem.variant.product.id == productId) {
                        quantityInCart += lineItem.quantity
                    }
                });
                console.log('found (' + quantityInCart + ') items in checkout');
                if (quantityInCart > 1) { resolve(true); }
                else { resolve(false); }
            },
            () => { console.log('unable to count line items but should'); reject(); }
        )
    })
}

function addLineItem(client, checkoutId, variantId, quantity) {
    return new Promise((resolve, reject) => {
        let lineItemToAdd = [
            {
                variantId: btoa(variantId),
                quantity: quantity
            }];
        client.checkout.addLineItems(btoa(checkoutId), lineItemToAdd).then(
            (checkout) => { console.log('lineitem added'); resolve(checkout); },
            () => { console.log('lineitem not added but should'); reject(); }
        )
    })
}

function updateLineItem(client, checkoutId, lineItemId, quantity) {
    return new Promise((resolve, reject) => {
        let lineItemToUpdate = [
            {
                id: btoa(lineItemId),
                quantity: quantity
            }
        ];
        client.checkout.updateLineItems(btoa(checkoutId), lineItemToUpdate).then(
            () => { console.log('lineitem updated'); resolve(); },
            () => { console.log('lineitem not update but should'); reject(); }
        )
    })
}

function itemInCart(client, checkoutId, variantId) {
    return new Promise((resolve, reject) => {
        client.checkout.fetch(checkoutId).then(
            (checkout) => {
                let isItemInCart = false;
                if (checkout.lineItems.length > 0) {
                    checkout.lineItems.forEach((lineItem) => {
                        if (variantId == lineItem.variant.id) {
                            isItemInCart = true;
                            console.log('found item in cart'); resolve(lineItem);
                        }
                    })
                }
                if (!isItemInCart) { reject(); }
            },
            () => {
                console.log('item not found in cart'); reject();
            }
        )
    })
}

function updateCart(client, productId, variantId, quantity) {
    // deleteCart();    
    cartExist().then(
        (checkoutId) => {
            itemInCart(client, checkoutId, variantId)
                .then(
                    (lineItem) => { updateLineItem(client, checkoutId, lineItem.id, quantity + lineItem.quantity); },
                    () => { addLineItem(client, checkoutId, variantId, quantity); }
                ).then(
                    () => {
                        discountEligibility(client, checkoutId, productId).then(
                            (eligible) => {
                                if (eligible) { applyDiscount(client, checkoutId, 'CANDYRACK-W7OJZQP91P'); console.log('discount applied') }
                                else { clearDiscount('CANDYRACK-W7OJZQP91P'); console.log('discount removed') }
                            },
                            () => { console.log('discount not applied') }
                        );
                    });
        },
        () => {
            createCart(client).then(
                (checkoutId) => { addLineItem(client, checkoutId, variantId, quantity); })
        }
    );
}