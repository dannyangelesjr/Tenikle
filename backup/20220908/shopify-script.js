const scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
const shopifyDomain = 'tenikle.myshopify.com';
const shopifyAccessToken = 'f4b463a7038ebe9367370e6e50c04b5e';

const _discountCode = 'CANDYRACK-W7OJZQP91P';
const _discountProductId = 'gid://shopify/Product/4958989615190';
let _checkoutId;

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
    const client = ShopifyBuy.buildClient({
        domain: shopifyDomain,
        storefrontAccessToken: shopifyAccessToken,
    });

    ShopifyBuy.UI.onReady(client).then(function (ui) {
        ui.createComponent('product', {
            id: '4958989615190',
            node: document.getElementById('product-component-1660181892296'),
            moneyFormat: '%24%7B%7Bamount%7D%7D',
            options: {
                "product": {
                    "buttonDestination": 'cart',
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
                    "events": {
                        afterInit: function () {
                            console.log('*** afterInit START');
                            cart_get().then(
                                () => { console.log('cart available and info retrieved'); console.log('*** afterInit END'); },
                                () => { console.log('cart unavailable'); console.log('*** afterInit END'); }
                            )
                        },
                        addVariantToCart: function (product) {
                            console.log('*** addVariantToCart START');
                            discount_eligibilityApplication(client, product.cart, _checkoutId, product.storefrontId, _discountCode, product.selectedQuantity).then(
                                () => { updateView(client, _checkoutId, product.storefrontId); showModal(true); console.log('*** addVariantToCart END'); },
                                () => { console.log('*** addVariantToCart END'); })
                        },
                        updateVariant: function (product) {
                            console.log('*** updateVariant START');
                            discount_eligibilityApplication(client, product.cart, _checkoutId, product.storefrontId, _discountCode, product.selectedQuantity).then(
                                () => { console.log('*** updateVariant END'); },
                                () => { console.log('*** updateVariant END'); })
                        },
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
                    ],
                    "events": {
                        openCheckout: function (cart) {
                            console.log('*** openCheckout START')
                            cart.lineItems.forEach((lineItem) => {
                                discount_eligibilityApplication(client, cart, _checkoutId, lineItem.variant.product.id, _discountCode, 0).then(
                                    () => { console.log('*** openCheckout END') },
                                    () => { console.log('*** openCheckout END') }
                                )
                            })
                        },
                        updateItemQuantity: function (cart) {
                            console.log('*** updateItemQuantity START')
                            cart.lineItems.forEach((lineItem) => {
                                discount_eligibilityApplication(client, cart, _checkoutId, lineItem.variant.product.id, _discountCode, 0).then(
                                    () => {
                                        updateView(client, _checkoutId, lineItem.variant.product.id);
                                        console.log('*** updateItemQuantity END')
                                    },
                                    () => { console.log('*** updateItemQuantity END') }
                                )
                            })
                        },
                    },
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
        ui.createComponent('product', {
            id: '4958989615190',
            node: document.getElementById('product-component-1660181892297'),
            moneyFormat: '%24%7B%7Bamount%7D%7D',
            options: {
                "product": {
                    "buttonDestination": 'cart',
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
                    "events": {
                        addVariantToCart: function (product) {
                            console.log('*** addVariantToCart START');
                            discount_eligibilityApplication(client, product.cart, _checkoutId, product.storefrontId, _discountCode, product.selectedQuantity).then(
                                () => { updateView(client, _checkoutId, product.storefrontId); showModal(false); console.log('*** addVariantToCart END'); },
                                () => { console.log('*** addVariantToCart END'); })
                        },
                        updateVariant: function (product) {
                            console.log('*** updateVariant START');
                            discount_eligibilityApplication(client, product.cart, _checkoutId, product.storefrontId, _discountCode, product.selectedQuantity).then(
                                () => { console.log('*** updateVariant END'); },
                                () => { console.log('*** updateVariant END'); })
                        },
                    },
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
                    ],
                    "events": {
                        openCheckout: function (cart) {
                            console.log('*** openCheckout START')
                            cart.lineItems.forEach((lineItem) => {
                                discount_eligibilityApplication(client, cart, _checkoutId, lineItem.variant.product.id, _discountCode, 0).then(
                                    () => { console.log('*** openCheckout END') },
                                    () => { console.log('*** openCheckout END') }
                                )
                            })
                        },
                        updateItemQuantity: function (cart) {
                            console.log('*** updateItemQuantity START')
                            cart.lineItems.forEach((lineItem) => {
                                discount_eligibilityApplication(client, cart, _checkoutId, lineItem.variant.product.id, _discountCode, 0).then(
                                    () => {
                                        updateView(client, _checkoutId, lineItem.variant.product.id);
                                        showModal(true);
                                        console.log('*** updateItemQuantity END')
                                    },
                                    () => { console.log('*** updateItemQuantity END') }
                                )
                            })
                        },
                    },
                },
            },
        });
    });
}

function discount_eligibilityApplication(client, cart, checkoutId, productId, discountCode, quantity) {
    return new Promise((resolve, reject) => {
        let isEligible = discount_isEligible(cart, productId, discountCode, quantity);
        let isDiscountApplied = discount_isExist(cart);
        if (isEligible && !isDiscountApplied) {
            discount_apply(client, checkoutId, discountCode).then(
                () => { console.log('after discount_apply and suceeded'); resolve() },
                () => { console.log('after discount_apply and failed'); reject(); });
        }
        else if (!isEligible && isDiscountApplied) {
            discount_clear(client, checkoutId, discountCode).then(
                () => { console.log('after discount_clear'); resolve(); },
                () => { console.log('after discount_clear and failed'); reject(); })
        }
        else {
            console.log('after discount_clear. No discount applied or removed');
            resolve();
        }
    })
}

function showModal(isVisible) {
    let upsellModal = document.getElementById("upsellModal");
    upsellModal.hidden = !isVisible;
    console.log('modal frame visible = ' + isVisible);
    if (isVisible) {
        console.log('showing modal frame for buyButton');
        let iframe = document.getElementsByName('frame-product-4958989615190');
        for (let i = 0; i < iframe.length; i++) {
            if (isVisible) {
                iframe[i].style.height = '108px';
            }
            else {
                iframe[i].style.height = '0px';
            }
        }
    }
}

function cart_get() {
    return new Promise((resolve, reject) => {
        let isCartExist = false;
        for (var checkoutId, key, i = 0; i < localStorage.length; ++i) {
            key = localStorage.key(i);
            if (key.match(shopifyDomain + '.checkoutId')) {
                checkoutId = localStorage.getItem(key);
                isCartExist = true;
                _checkoutId = checkoutId;
                break;
            }
        }
        if (isCartExist) {
            console.log('found cart!');
            resolve(checkoutId);
        }
        else {
            console.log('no cart found'); reject();
        }
    })
}

function discount_isExist(cart) {
    let isDiscountExist = false;
    if (cart.lineItems.length > 0) {
        cart.lineItems.forEach((lineItem) =>
            lineItem.discountAllocations.forEach((discountAllocation) => {
                if (discountAllocation.discountApplication.code == _discountCode) {
                    isDiscountExist = true;
                }
            })
        )
    }
    if (isDiscountExist) { console.log('discount in cart '); return true; }
    else { console.log('discount not  in cart'); return false; }
}

function discount_isEligible(cart, productId, discountCode, quantityToAddToCart) {
    let isRuleSatisfied = ruleQuantityForDiscount_isSatisfied(cart, productId, quantityToAddToCart);
    if (isRuleSatisfied) {
        console.log('eligible for discount');
        return true;
    }
    else {
        console.log('does not meet min qty. Not eligible for discount');
        return false;
    }
}

function discount_apply(client, checkoutId, discountCode) {
    return new Promise((resolve, reject) => {
        let isAddedDiscount = false;
        client.checkout.addDiscount(btoa(checkoutId), discountCode).then(
            () => {
                isAddedDiscount = true;
                resolve();
                console.log('added discount');
            },
            () => {
                reject();
                console.log('unable to add discount but should')
            })

    })
}

function discount_clear(client, checkoutId, discountCode) {
    return new Promise((resolve, reject) => {
        client.checkout.fetch(checkoutId).then((checkout) => {
            let isDiscountRemoved = false;
            checkout.discountApplications.forEach((discountApplication) => {
                if (discountApplication.code == discountCode) {
                    client.checkout.removeDiscount(checkoutId).then(
                        () => {
                            isDiscountRemoved = true;
                            console.log('removed discount');
                            resolve(true);
                        },
                        () => {
                            reject();
                            console.log('unable to remove discount but should');
                        }
                    )
                }
            })
        })
    })
}

function ruleQuantityForDiscount_isSatisfied(cart, productId, quantityToAddToCart) {
    let quantityInCart = quantityToAddToCart;
    if (cart.lineItems.length > 0) {
        cart.lineItems.forEach((lineItem) => {
            if (lineItem.variant.product.id == productId) {
                quantityInCart += lineItem.quantity
            }
        })
    }
    console.log('found (' + quantityInCart + ') items in checkout')
    return quantityInCart > 1;
}

function updateView(client, checkoutId, productId) {
    let $productId = document.getElementById('productId');
    let $productName = document.getElementById('productName');
    let $productPrice = document.getElementById('productPrice');
    let $productImage = document.getElementById('productImage');

    let $productNameUpsell = document.getElementById('productNameUpsell');
    let $productImageUpsell = document.getElementById('productImageUpsell');
    let $productPriceBeforeDiscount = document.getElementById('productPriceBeforeDiscount');
    let $productPriceAfterDiscount = document.getElementById('productPriceAfterDiscount');

    client.product.fetch(btoa(productId)).then((product) => {
        $productId.textContent = product.id;
        $productNameUpsell.textContent = product.title;
        $productImageUpsell.src = product.images[0].src;
        $productImageUpsell.style.height = '50px';
        $productImageUpsell.style.width = '50px';
        $productPriceBeforeDiscount.textContent = '$ ' + Number(product.variants[0].priceV2.amount).toFixed(2) + ' ' + product.variants[0].priceV2.currencyCode;

        client.checkout.fetch(checkoutId).then((checkout) => {
            checkout.lineItems.forEach((lineItem) => {
                $productName.textContent = lineItem.title;
                $productPrice.textContent = '$ ' + Number(lineItem.variant.priceV2.amount).toFixed(2) + ' ' + lineItem.variant.priceV2.currencyCode;
                $productImage.src = lineItem.variant.image.src;
                $productImage.style.height = '50px';
                $productImage.style.width = '50px';

                lineItem.discountAllocations.forEach((discountAllocation) => {
                    $productPriceAfterDiscount.textContent = '$ ' + Number(Number(lineItem.variant.priceV2.amount) - (Number(lineItem.variant.priceV2.amount) * (Number(discountAllocation.discountApplication.value.percentage) / 100))).toFixed(2) + ' ' + discountAllocation.allocatedAmount.currencyCode;
                })
            })
        });
    })
}