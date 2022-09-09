function addingVariantToCart(client, checkoutId, product, discountCode) {
    return new Promise((resolve, reject) => {
        discount_eligibilityApplication(client, product.cart, checkoutId, product.storefrontId, discountCode, product.selectedQuantity);
        updateView(client, checkoutId, product.storefrontId).then(
            () => {
                showModal(true);
                console.log('*** updateVariant END');
                resolve();
            }
        )

    })
}


function updatingVariant(client, checkoutId, product, discountCode) {
    return new Promise((resolve, reject) => {
        console.log('*** updateVariant START');
        discount_eligibilityApplication(client, product.cart, checkoutId, product.storefrontId, discountCode, product.selectedQuantity);
        updateView(client, checkoutId, product.storefrontId).then(
            showModal(true))
        console.log('*** updateVariant END');
        resolve();
    })
}

function openingCheckout(client, cart, checkoutId, discountCode) {
    console.log('*** openCheckout START')
    for (const lineItem of cart.linteItems) {
        discount_eligibilityApplication(client, cart, checkoutId, lineItem.variant.product.id, discountCode, 0)
    }
    console.log('*** openCheckout END');
}

function updatingItemQuantity(client, cart, checkoutId, discountCode) {
    return new Promise((resolve, reject) => {
        console.log('*** updateItemQuantity START')
        for (const lineItem of cart.lineItems) {
            discount_eligibilityApplication(client, cart, checkoutId, lineItem.variant.product.id, discountCode, 0);
        }
        console.log('*** updateItemQuantity END');
        resolve();
    })
}

function discount_eligibilityApplication(client, cart, checkoutId, productId, discountCode, quantity) {
    return new Promise((resolve, reject) => {
        let isDiscountExist = discount_isExist(cart);
        let isDiscountEligible = discount_isEligible(cart, productId, discountCode, quantity)

        if (isDiscountExist) {
            if (isDiscountEligible) {
                console.log('eligible for discount and discount in cart. Nothing to do');
                resolve(true);
            }
            else {
                console.log('not eligible for discount and discount in cart. Removing');
                discount_clear(client, checkoutId, discountCode).then(
                    console.log('discount cleared succesfully'));
                resolve(true);
            }
        }
        else {
            if (isDiscountEligible) {
                console.log('eligible for discount and discount not in cart. Adding');
                discount_apply(client, checkoutId, discountCode).then(
                    console.log('discount cleared succesfully'));
                resolve(true);
            }
            else {
                console.log('not eligible for discount and discount not in cart. Nothing to do');
                resolve(true);
            }
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
        for (const lineItem of cart.lineItems) {
            for (const discountAllocation of lineItem.discountAllocations) {
                if (discountAllocation.discountApplication.code == _discountCode) {
                    isDiscountExist = true;
                }
            };
        }
    }
    if (isDiscountExist) {
        console.log('discount in cart');
    } else {
        console.log('discount not in cart');
    }
    return isDiscountExist;
}

function discount_isEligible(cart, productId, discountCode, quantityToAddToCart) {
    let isRuleSatisfied = ruleQuantityForDiscount_isSatisfied(cart, productId, quantityToAddToCart)
    if (isRuleSatisfied) {
        console.log('eligible for discount');
        return (true);
    }
    else {
        console.log('does not meet discount requirement. Not eligible for discount');
        return (false);
    }
}

async function discount_apply(client, checkoutId, discountCode) {
    console.log('trying to add discount ' + checkoutId + ' ' + discountCode);
    await client.checkout.addDiscount(btoa(checkoutId), discountCode).then(
        console.log('added discount'))
}

async function discount_clear(client, checkoutId, discountCode) {
    console.log('trying to remove discount');
    const checkout = await client.checkout.fetch(checkoutId);
    for (const discountApplication of checkout.discountApplications) {
        if (discountApplication.code == discountCode) {
            client.checkout.removeDiscount(checkoutId).then(
                console.log('removed discount'))
        }
    }
}

function ruleQuantityForDiscount_isSatisfied(cart, productId, quantityToAddToCart) {
    let quantityInCart = quantityToAddToCart;
    if (cart.lineItems.length > 0) {
        for (const lineItem of cart.lineItems) {
            if (lineItem.variant.product.id == productId) {
                quantityInCart += lineItem.quantity
            }
        }
        console.log('found (' + quantityInCart + ') items in checkout')
    }
    return (quantityInCart > 1);
}

function updateView(client, checkoutId, productId) {
    return new Promise((resolve, reject) => {
        let $productId = document.getElementById('productId');
        let $productName = document.getElementById('productName');
        let $productPrice = document.getElementById('productPrice');
        let $productImage = document.getElementById('productImage');

        let $productNameUpsell = document.getElementById('productNameUpsell');
        let $productImageUpsell = document.getElementById('productImageUpsell');
        let $productPriceBeforeDiscount = document.getElementById('productPriceBeforeDiscount');
        let $productPriceAfterDiscount = document.getElementById('productPriceAfterDiscount');

        console.log('1. fetching by productId to display productName etc')
        new Promise((resolve, reject) => {
            client.product.fetch(btoa(productId)).then(
                (product) => {
                    $productId.textContent = product.id;
                    $productNameUpsell.textContent = product.title;
                    $productImageUpsell.src = product.images[0].src;
                    $productImageUpsell.style.height = '50px';
                    $productImageUpsell.style.width = '50px';
                    $productPriceBeforeDiscount.textContent = '$ ' + Number(product.variants[0].priceV2.amount).toFixed(2) + ' ' + product.variants[0].priceV2.currencyCode;
                }
            )
            resolve();
        }).then(() => {
            console.log('2. fetching by checkoutId to display productName etc');
            new Promise((resolve, reject) => {
                client.checkout.fetch(checkoutId).then(
                    (checkout) => {
                        console.log('3. about to retrieve productName etc.')
                        for (const lineItem of checkout.lineItems) {
                            console.log('4. looping to retrieve productName etc.')
                            $productName.textContent = lineItem.title;
                            $productPrice.textContent = '$ ' + Number(lineItem.variant.priceV2.amount).toFixed(2) + ' ' + lineItem.variant.priceV2.currencyCode;
                            $productImage.src = lineItem.variant.image.src;
                            $productImage.style.height = '50px';
                            $productImage.style.width = '50px';

                            console.log('5. about foreach discountallocation to retrieve productName etc')
                            for (const discountAllocation of lineItem.discountAllocations) {
                                console.log('6. looping discountallocation to retrieve productName etc')
                                $productPriceAfterDiscount.textContent = '$ ' + Number(Number(lineItem.variant.priceV2.amount) - (Number(lineItem.variant.priceV2.amount) * (Number(discountAllocation.discountApplication.value.percentage) / 100))).toFixed(2) + ' ' + discountAllocation.allocatedAmount.currencyCode;
                            }
                            console.log('7. out of the loop about foreach discountallocation to retrieve productName etc');
                        }
                        console.log('8. out of the loop to retrieve productName etc');
                    }
                )
                resolve();
            }).then(() => {
                console.log('9. resolved to retrieve productName etc');
                resolve();
            })
        })
    })
}