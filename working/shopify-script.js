var scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
const shopifyDomain = 'tenikle.myshopify.com';
const iframe = document.getElementById('myIframe');
const iframeWindow = iframe.contentWindow;

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

              updateCart(product);
              iframe.style.display = "block";
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

  setupModal();
}

function setupModal() {
  // Get the <span> element that closes the modal
  // When the user clicks on <span> (x), close the modal
  var btnClose = iframeWindow.document.getElementById('btnClose');
  btnClose.onclick = function () {
    iframe.style.display = "none";
  };

  // Get the continue button
  // when the user clicks the continue button, redirect to checkout
  let btnContinue = iframeWindow.document.getElementById('btnContinue');
  btnContinue.onclick = function () {
    window.location.replace("https://www.tenikle.com/cart")
  }

  // Get the add button
  // When the user clicks the add button
  let btnAdd = iframeWindow.document.getElementById('btnAdd');
  btnAdd.onclick = function () {
    let productId = iframeWindow.document.getElementById('productName');
    let variantId = iframeWindow.document.getElementById('productPrice');
    let quantity = iframeWindow.document.getElementById('variantQuantity');
    addLineItem(client, checkoutId, productId, variantId, quantity)
  };

  // When the user clicks anywhere outside of the modal, close it
  let modal = document.getElementById('myModal');
  window.onclick = function (event) {
    if (event.target == modal) {
      iFrame.style.display = "none";
    }
  };
}

function updateCart(product) {
  let productId = product.product[0].model.id;
  let variantId = product.product[0].selectedVariant.id;
  let quantity = product.product[0].selectedQuantity;

  const client = ShopifyBuy.buildClient({
    domain: shopifyDomain,
    storefrontAccessToken: 'f4b463a7038ebe9367370e6e50c04b5e',
  })

  for (var checkoutId, key, i = 0; i < localStorage.length; ++i) {
    key = localStorage.key(i); if (key.match(shopifyDomain + '.checkoutId')) {
      checkoutId = localStorage.getItem(key);

      if (checkoutId == null) {
        addLineItem(client, checkoutId, productId, variantId, quantity);
      }
      else {
        // check if product variant already exists in cart
        client.checkout.fetch(checkoutId).then((checkout) => {
          if (checkout.lineItems.length > 0) {
            let isAdd = true;
            checkout.lineItems.forEach((lineItem) => {
              if (variantId == lineItem.variant.id) {
                quantity = quantity + lineItem.quantity;
                updateLineItem(client, checkoutId, lineItem.id, productId, variantId, quantity)
                isAdd = false;
              }
            });
            if (isAdd) {
              addLineItem(client, checkoutId, productId, variantId, quantity);
            }
          }
          else {
            const discountCode = 'CANDYRACK-W7OJZQP91P';
            if (checkout.discountApplications.length == 0) {
              // Add a discount code to the checkout            
              client.checkout.addDiscount(checkoutId, discountCode).then(checkout => {
              })
            };
            addLineItem(client, checkoutId, productId, variantId, quantity);
          }
        })
      };
    }
  }
}

function addLineItem(client, checkoutId, productId, variantId, quantity) {
  let lineItem = [
    {
      variantId: btoa(variantId),
      quantity: quantity
    }
  ];

  // Create an empty checkout
  client.checkout.create().then((checkout) => {
    client.checkout.addLineItems(checkoutId, lineItem).then((checkout) => {
    });
  })
  updateView(client, checkoutId, productId);
}

function updateLineItem(client, checkoutId, lineItemId, productId, variantId, quantity) {
  let lineItem = [
    {
      id: btoa(lineItemId),
      quantity: quantity
    }
  ];

  client.checkout.updateLineItems(checkoutId, lineItem).then((checkout) => {
  });

  updateView(client, checkoutId, productId);
}

function updateView(client, checkoutId, productId) {
  let $productName = iframeWindow.document.getElementById('productName');
  let $productPrice = iframeWindow.document.getElementById('productPrice');
  let $productImage = iframeWindow.document.getElementById('productImage');

  let $productNameUpsell = iframeWindow.document.getElementById('productNameUpsell');
  let $productPriceAfterDiscount = iframeWindow.document.getElementById('productPriceUpsell');
  let $productImageUpsell = iframeWindow.document.getElementById('productImageUpsell');
  let $productPriceBeforeDiscount = iframeWindow.document.getElementById('productPriceBeforeDiscount');

  let $productVariants1 = iframeWindow.document.getElementById('productVariants1');
  let $productVariants2 = iframeWindow.document.getElementById('productVariants2');

  client.product.fetch(btoa(productId)).then((product) => {
    $productNameUpsell.innerHTML = product.title;
    $productImageUpsell.innerHTML = '<img src="' + product.images[0].src + '" alt="Product" class="h-mobileImageSmall md:h-desktopImageSmall w-mobileImageSmall md:w-desktopImageSmall object-scale-down">';
    $productPriceBeforeDiscount.text = '$ ' + Number(product.variants[0].priceV2.amount).toFixed(2) + ' ' + product.variants[0].priceV2.currencyCode;

    let productVariant = '';
    product.variants.forEach((variant) => {
      if (variant.available) {
        productVariant += '<option value="' + (variant.id) + '">' + variant.title + '</option>';
      }
    });

    $productVariants1.innerHTML = productVariant;
    $productVariants2.innerHTML = productVariant;

    client.checkout.fetch(checkoutId).then((checkout) => {
      checkout.lineItems.forEach((lineItem) => {
        $productName.innerHTML = lineItem.title;
        $productPrice.text = '$ ' + Number(lineItem.variant.priceV2.amount).toFixed(2) + ' ' + lineItem.variant.priceV2.currencyCode;
        $productImage.innerHTML = '<img src="' + lineItem.variant.image.src + ' alt="Product" class="block w-50 h-50 object-cover"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="100%" height="100%" class="animated-checkmark--finished absolute top-0 rounded-full block stroke-5 stroke-white z-20 -mt-8 -mr-8 right-0 w-15 h-15"><circle class="checkmark__circle stroke-2 stroke-green" cx="26" cy="26" r="25" fill="none"></circle><path class="checkmark__check origin-center" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"></path></svg>';

        lineItem.discountAllocations.forEach((discountAllocation) => {
          $productPriceAfterDiscount.text('$ ' + Number(lineItem.variant.priceV2.amount - discountAllocation.allocatedAmount.amount).toFixed(2) + ' ' + discountAllocation.allocatedAmount.currencyCode);
        })
      })
    });
  })
}