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
          "DOMEvents": {
            'click .shopify-buy__btn': function (evt, target) {
              let data = target;
              let product = ui.components;

              updateCart(product.product[0].model.id, product.product[0].selectedVariant.id, product.product[0].selectedQuantity);

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

const shopifyDomain = 'tenikle.myshopify.com';

function addDiscount(checkoutId, discountCode) {
  console.log('*** [addDiscount] start');

  console.log('[addDiscount] discountApplications.length = ' + discountApplications.length);
  if (checkout.discountApplications.length == 0) {
    console.log('[addDiscount] adding discount start');
    // Add a discount code to the checkout            
    client.checkout.addDiscount(checkoutId, discountCode).then(checkout => {
      console.log('[addDiscount] added discount');
    })
    console.log('[addDiscount] adding discount end');
  }
  else {
    console.log('[addDiscount] checking if discount exists (2nd)');
    checkout.discountApplications.forEach((discountApplication) => {
      if (discountApplication.discountCode == discountCode) {
        console.log('[addDiscount] discount exists (2nd)');
        exit;
      }
      console.log('[addDiscount] discount does not exist (2nd)');
      client.checkout.addDiscount(checkoutId, discountCode).then(checkout => {
        console.log('[addDiscount] added discount (2nd)');
      })
      console.log('[addDiscount] adding discount end (2nd)');
    })
  }
  console.log('*** [addDiscount] end');
}

function removeDiscount(checkoutId) {
  console.log('*** [removeDiscount] start');
  if (checkout.discountApplications.length == 0) {
    console.log('[removeDiscount] discount CANDYRACK-W7OJZQP91P not found. Applying discount.');
    // Add a discount code to the checkout            
    client.checkout.removeDiscount(checkoutId).then(checkout => {
      console.log('[removeDiscount] discount CANDYRACK-W7OJZQP91P applied');
    })
    console.log('[removeDiscount] discount CANDYRACK-W7OJZQP91P post');
  };
  console.log('*** [removeDiscount] end');
}

function getCheckoutId() {
  console.log('[updateCart] checking localStorage for checkoutId');
  for (var checkoutId, key, i = 0; i < localStorage.length; ++i) {
    key = localStorage.key(i);
    if (key.match(shopifyDomain + '.checkoutId')) {
      checkoutId = localStorage.getItem(key);
      return checkoutId
    }
  }
}

function updateCart(productId, variantId, quantity) {
  console.log('*** [updateCart] start with productId = ' + productId + ', ' + variantId + ', ' + quantity);

  const client = ShopifyBuy.buildClient({
    domain: shopifyDomain,
    storefrontAccessToken: 'f4b463a7038ebe9367370e6e50c04b5e',
  })
}

function addLineItem(client, checkoutId, productId, variantId, quantity) {
  console.log('*** [addLineitem] start with parameters ' + checkoutId + ',' + productId + ',' + variantId);
  let lineItem = [
    {
      variantId: btoa(variantId),
      quantity: quantity
    }
  ];

  if (checkoutId == null) {
    client.checkout.create().then((checkout) => {
      client.checkout.addLineItems(checkoutId, lineItem).then((lineItem) => {
        updateView(client, checkoutId, productId);
      })
    })
  }
  else {
    console.log('[addLineitem] checkoutId is not null. Fetching cart ' + checkoutId);
    client.checkout.fetch(checkoutId).then((checkout) => {
      console.log('[addLineitem] adding lineitem ' + lineItem);
      checkout.addLineItems(checkoutId, lineItem).then((lineItem) => {
        console.log('[addLineitem] added lineitem ' + lineItem);
        updateView(client, checkoutId, productId);
      })
    })
  }
  console.log('*** [addLineitem] end');
}

function updateLineItem(client, checkoutId, lineItemId, productId, variantId, quantity) {
  console.log('*** [updateLineItem] start with parameters ' + checkoutId + ',' + productId + ',' + variantId);
  let lineItem = [
    {
      id: btoa(lineItemId),
      quantity: quantity
    }
  ];

  console.log('[updateLineItem] fetching cart with checkoutId = ' + checkoutId);
  client.checkout.fetch(checkoutId).then((checkout) => {
    console.log('[updateLineItem] fetched cart with checkoutId = ' + checkoutId);
    console.log('[updateLineItem] updateLineItems->start');
    checkout.updateLineItems(checkoutId, lineItem).then((lineItem) => {
      console.log('[updateLineItem] updateLineItems->end');
      updateView(client, checkoutId, productId);
    })
  })
  console.log('*** [updateLineItem] end');
}

function updateView(client, checkoutId, productId) {

  console.log('updating view ' + checkoutId + ',' + productId);

  try {
    console.log('productId');
    let $productId = document.getElementById('productId');

    console.log('productName');
    let $productName = document.getElementById('productName');

    console.log('productPrice');
    let $productPrice = document.getElementById('productPrice');

    console.log('productImage');
    let $productImage = document.getElementById('productImage');

    console.log('productNameUpsell');
    let $productNameUpsell = document.getElementById('productNameUpsell');

    console.log('productPriceAfterDiscount');
    let $productPriceAfterDiscount = document.getElementById('productPriceUpsell');

    console.log('productImageUpsell');
    let $productImageUpsell = document.getElementById('productImageUpsell');

    console.log('productPriceBeforeDiscount');
    let $productPriceBeforeDiscount = document.getElementById('productPriceBeforeDiscount');

    console.log('productVariants');
    let $productVariants = document.getElementById('productVariants');

    console.log('client.product.fetch');
    client.product.fetch(btoa(productId)).then((product) => {
      console.log('updating productid ' + product.id);
      $productId.innerHTML = product.id;
      console.log('updated productid ' + product.id);

      console.log('updating productNameUpsell ' + product.title);
      $productNameUpsell.innerHTML = product.title;
      console.log('updated productNameUpsell ' + product.title);

      console.log('updating productImageUpsell ' + product.images[0].src);
      // $productImageUpsell.innerHTML = '<img src="' + product.images[0].src + '" alt="Product" class="h-mobileImageSmall md:h-desktopImageSmall w-mobileImageSmall md:w-desktopImageSmall object-scale-down">';
      $productImageUpsell.src = product.images[0].src;
      console.log('updated productImageUpsell ' + product.images[0].src);

      console.log('updating productPriceBeforeDiscount ' + product.variants[0].priceV2.amount);
      $productPriceBeforeDiscount.innerHTML = '$ ' + Number(product.variants[0].priceV2.amount).toFixed(2) + ' ' + product.variants[0].priceV2.currencyCode;
      console.log('updated productPriceBeforeDiscount ' + product.variants[0].priceV2.amount);

      let productVariants = '';
      product.variants.forEach((variant) => {

        console.log('updating productVariants ' + variant.id);

        if (variant.available) {
          productVariants += '<option value="' + (variant.id) + '">' + variant.title + '</option>';
        }

        console.log('updated productVariants ' + variant.id);

      });
      $productVariants.innerHTML = productVariants;

      client.checkout.fetch(checkoutId).then((checkout) => {
        checkout.lineItems.forEach((lineItem) => {

          console.log('updating product title ' + lineItem.title);
          $productName.innerHTML = lineItem.title;
          console.log('updated product title ' + lineItem.title);

          console.log('updating product price ' + lineItem.variant.priceV2.amount);
          $productPrice.innerHTML = '$ ' + Number(lineItem.variant.priceV2.amount).toFixed(2) + ' ' + lineItem.variant.priceV2.currencyCode;
          console.log('updating product price ' + lineItem.variant.priceV2.amount);

          console.log('updating product image ' + lineItem.variant.image.src);
          // $productImage.innerHTML = '<img src="' + lineItem.variant.image.src + ' alt="Product" class="block w-50 h-50 object-cover"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="100%" height="100%" class="animated-checkmark--finished absolute top-0 rounded-full block stroke-5 stroke-white z-20 -mt-8 -mr-8 right-0 w-15 h-15"><circle class="checkmark__circle stroke-2 stroke-green" cx="26" cy="26" r="25" fill="none"></circle><path class="checkmark__check origin-center" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"></path></svg>';
          $productImage.src = lineItem.variant.image.src;
          console.log('updated product image ' + lineItem.variant.image.src);

          console.log('*** START DISCOUNT ALLOCATION ' + lineItem.variant);
          lineItem.discountAllocations.forEach((discountAllocation) => {
            console.log('updating productPriceAfterDiscount.lineItem.variant.priceV2.amount ' + lineItem.variant.priceV2.amount);
            console.log('updating productPriceAfterDiscount.discountAllocation.allocatedAmount.amount ' + discountAllocation.allocatedAmount.amount);
            $productPriceAfterDiscount.innerHTML = '$ ' + Number(lineItem.variant.priceV2.amount - discountAllocation.allocatedAmount.amount).toFixed(2) + ' ' + discountAllocation.allocatedAmount.currencyCode;
            console.log('updated productPriceAfterDiscount ' + discountAllocation.allocatedAmount.amount);
          })
          console.log('*** END DISCOUNT ALLOCATION ' + lineItem.variant);
        })
      });
    })

    console.log('view updated ' + checkoutId + ',' + productId + ',');
  }
  catch (ex) {
    console.log(ex);
  }
}