/** override v1 OffAmazonPayments */
var OffAmazonPayments = (function () {
  // button
  var amznBtnId;
  var merchantId;
  amazon.Login = (function () {
    var _returnUrl;
    var _clientId;
    var _loginOptions;
    return {
      authorize: function (loginOptions, url) {
        _returnUrl = url;
        _loginOptions = loginOptions;
      },
      getReturnUrl: function () {
        return _returnUrl;
      },
      setClientId: function (clientId) {
        _clientId = clientId;
      },
      getClientId: function () {
        return _clientId;
      },
      getLoginOptions: function () {
        return _loginOptions;
      },
      setUseCookie: function (cookie) { },
      logout: function () {
        amazon.Pay.signout();
      }
    };
  })();
  // widgets
  var walletElmId;
  var addressBookElmId;
  return {
    Button: function (id, mid, obj) {
      amznBtnId = id;
      merchantId = mid;
      obj.authorization();
    },
    getLoginOptions: function () {
      return amazon.Login.getLoginOptions();
    },
    getClientId: function () {
      return amazon.Login.getClientId();
    },
    getBtnElmId: function () {
      return amznBtnId;
    },
    getMerchantId: function () {
      return merchantId;
    },
    Widgets: {
      Wallet: function (obj) {
        return {
          bind: function (id) {
            OffAmazonPayments.Widgets.setWalletElmId(id);
          },
          getElmId: function () {
            return walletElmId;
          },
        };
      },
      setWalletElmId: function (id) {
        walletElmId = id;
      },
      getWalletElmId: function () {
        return walletElmId;
      },
      AddressBook: function (obj) {
        return {
          bind: function (id) {
            OffAmazonPayments.Widgets.setAddressElmId(id);
            this.executeReady(); // for execute wallet widgets
          },
          getElmId: function () {
            return addressBookElmId;
          },
          executeReady: function () {
            if (obj.hasOwnProperty('onReady')) {
              obj.onReady({
                getAmazonOrderReferenceId: function () {},
              });
            }

            if (obj.hasOwnProperty('onOrderReferenceCreate')) {
              obj.onOrderReferenceCreate({
                getAmazonOrderReferenceId: function () {},
              });
            }
          },
        };
      },
      setAddressElmId: function (id) {
        addressBookElmId = id;
      },
      getAddressElmId: function () {
        return addressBookElmId;
      },
    },
  };
})();
/** v1->v2 converter */
var amazonpayV2Converter = (function () {
  var region = 'ja';
  var msgs = {
    ja: {
      buttonValue: '変更',
      failureAddress: '住所情報を取得できません。他のお支払い方法をお選びください。'
    },
    en: {
      buttonValue: 'Change',
      failureAddress: 'Failed to obtain your address. Select another payment method.'
    }
  };

  ({
    // This allows IE to use Object.assign method.
    setObjectAssign: function () {
      if (!Object.assign) {
        Object.defineProperty(Object, 'assign', {
          enumerable: false,
          configurable: true,
          writable: true,
          value: function (target) {
            if (target === undefined || target === null) {
              throw new TypeError('Cannot convert first argument to object');
            }
            var to = Object(target);
            for (var i = 1; i < arguments.length; i++) {
              var nextSource = arguments[i];
              if (nextSource === undefined || nextSource === null) {
                continue;
              }
              nextSource = Object(nextSource);
              var keysArray = Object.keys(Object(nextSource));
              for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                var nextKey = keysArray[nextIndex];
                var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                if (desc !== undefined && desc.enumerable) {
                  to[nextKey] = nextSource[nextKey];
                }
              }
            }
            return to;
          },
        });
      }
    },
    // add stylesheet for loading icon
    setLoadingIconStyle: function () {
      var styleSheet = document.styleSheets[0];
      var keyframes = '@keyframes loaderAnime {0% {transform: rotate(0deg);-ms-transform: rotate(0deg);-webkit-transform: rotate(0deg);-moz-transform: rotate(0deg);}100% {transform: rotate(360deg);-ms-transform: rotate(360deg);-webkit-transform: rotate(360deg);-moz-transform: rotate(360deg);}}';
      var cssRules = styleSheet.rules || styleSheet.cssRules;
      styleSheet.insertRule(keyframes, cssRules.length);
    },
    executeV1Script: function () {
      if (window.hasOwnProperty('onAmazonLoginReady')) onAmazonLoginReady();
      if (window.hasOwnProperty('onAmazonPaymentsReady')) onAmazonPaymentsReady();
    },
    init: function () {
      this.setObjectAssign();
      this.setLoadingIconStyle();
      this.executeV1Script();
    }
  }).init();
  // show Amazon Pay Widgets
  var amazonPayWidgets = (function () {

    var loading = (function () {
      var styles = {
        width: '3em',
        height: '3em',
        borderTop: '0.3em solid rgba(140, 139, 139, 0.5)',
        borderRight: '0.3em solid rgba(140, 139, 139, 0.5)',
        borderBottom: '0.3em solid rgba(140, 139, 139, 0.5)',
        borderLeft: '0.3em solid #f3f3f3',
        animation: 'loaderAnime 1s infinite linear',
        borderRadius: '50%',
        position: 'relative',
        margin: 'auto',
        zIndex: '10000'
      };

      var loadingClassName = 'amznPayLoading';

      return {
        show: function (node) {
          var loadingWidgets = createNode('div').attrs({
            class: loadingClassName
          }).styles(styles);
          node.parts(loadingWidgets);
        },
        hide: function () {
          var loadings = document.getElementsByClassName(loadingClassName);
          for (var i = 0; i < loadings.length; i++) {
            loadings[i].style.display = 'none';
          }
        }
      }

    })();

    var walletContent = (function () {
      var amazonpayWalletClass = 'amazonpayWalletClass';

      function display(boolean) {
        var contents = document.getElementsByClassName(amazonpayWalletClass);
        for (var i = 0; i < contents.length; i++) {
          contents[i].style.display = boolean ? 'flex' : 'none';
        }
      }

      return {
        invisible: function () {
          display(false);
        },
        visible: function () {
          display(true);
          amazon.Pay.bindChangeAction('#' + this.getUpdateButtonId(), {
            amazonCheckoutSessionId: this.checkoutSessionId,
            changeAction: 'changePayment',
          });
        },
        className: function () {
          return amazonpayWalletClass;
        },
        exist: function () {
          return document.getElementById(OffAmazonPayments.Widgets.getWalletElmId()) ? true : false;
        },
        checkoutSessionId: null,
        getUpdateButtonId: function () {
          return 'updateWalletDetails';
        },
        getDescriptorId: function () {
          return 'updateWalletDescriptor';
        },
        setDescriptorText: function (text) {
          document.getElementById(this.getDescriptorId()).innerText = text;
        }
      }          
    })();

    return {
      button: function (createCheckoutSessionUrl, buttonParams) {
        // add loading div
        var payButton = document.getElementById(OffAmazonPayments.getBtnElmId());
        createNode(payButton).styles({
          margin: 'auto',
          position: 'relative'
        });
        payButton.addEventListener('click', function () {
          document.getElementById('amazonpay-loading').style.visibility = 'visible';
          createNode(payButton).styles({
            pointerEvents: 'none',
            opacity: '0.4'
          });
        });
        buttonParams = buttonParams || {};
        var renderConf = {
          merchantId: OffAmazonPayments.getMerchantId(),
          createCheckoutSession: {
            url: createCheckoutSessionUrl
          },
          ledgerCurrency: buttonParams.ledgerCurrency || 'JPY',
          checkoutLanguage: buttonParams.checkoutLanguage || 'ja_JP',
          productType: buttonParams.productType || 'PayAndShip',
          placement: buttonParams.placement || 'Cart'
        };
        renderConf.sandbox = buttonParams.sandbox ? true : false;
        amazon.Pay.renderButton('#' + OffAmazonPayments.getBtnElmId(), renderConf);
        var buttonHeight = payButton.offsetHeight || 10;
        var loadingTop = buttonHeight / 2;
        var loadingBtn = createNode('div').attrs({
          id: 'amazonpay-loading'
        }).styles({
          width: '1rem',
          height: '1rem',
          borderTop: '3px solid rgba(140, 139, 139, 0.5)',
          borderRight: '3px solid rgba(140, 139, 139, 0.5)',
          borderBottom: '3px solid rgba(140, 139, 139, 0.5)',
          borderLeft: '3px solid rgba(255, 255, 255, 0.1)',
          animation: 'loaderAnime 1s infinite linear',
          borderRadius: '50%',
          position: 'relative',
          top: -loadingTop + 'px',
          right: '0',
          bottom: '0',
          left: '0',
          margin: 'auto',
          zIndex: '10000',
          visibility: 'hidden'
        });
        payButton.insertAdjacentElement('afterend', loadingBtn);
      },
      address: function (setting) {
        setting = setting || {};
        var widgetsStyle = getWidgetsStyle(setting.widgetsStyle);

        var addressElm = document.getElementById(OffAmazonPayments.Widgets.getAddressElmId());

        var addressNode = createNode(addressElm).styles(widgetsStyle);

        loading.show(addressNode);

        addressNode.setAddress = function (shippingAddress) {
          var postalCode = shippingAddress.postalCode;
          var address = shippingAddress.stateOrRegion + shippingAddress.addressLine1;
          address += shippingAddress.addressLine2 || '';
          address += shippingAddress.addressLine3 || '';
          var widgets = createNode('div').parts(createNode('div').text(shippingAddress.name).styles({
            fontWeight: 'bold',
          }), createNode('div').text(postalCode), createNode('div').text(address));
          addressNode.parts(widgets);
          return this;
        }
        addressNode.setUpdateButton = function (checkoutSessionId) {
          var updateButton = getUpdateButton(setting.updateButtonStyle, 'updateCheckoutDetails');
          addressNode.parts(updateButton);
          amazon.Pay.bindChangeAction('#updateCheckoutDetails', {
            amazonCheckoutSessionId: checkoutSessionId,
            changeAction: 'changeAddress',
          });
        }
        addressNode.setErrorMessage = function (message) {
          addressNode.parts(createNode('div').text(message)).styles({
            color: '#ff0000'
          });
        }
        return {
          show: function (url, checkoutSessionId) {
            try {
              var postParam = JSON.stringify({
                "checkoutSessionId": checkoutSessionId
              });
              post(url).request(postParam).output(function (response) {
                loading.hide();

                if (response && response.hasOwnProperty('shippingAddress')) {
                  addressNode.setAddress(response.shippingAddress).setUpdateButton(checkoutSessionId);

                  if (walletContent.exist()) {
                    walletContent.visible();
                    if(response.hasOwnProperty('paymentPreferences') && response.paymentPreferences[0] && response.paymentPreferences[0].hasOwnProperty('paymentDescriptor'))
                      walletContent.setDescriptorText(response.paymentPreferences[0].paymentDescriptor);
                  }

                } else {
                  addressNode.setErrorMessage(msgs[region].failureAddress);
                }
              }).exec();
            } catch (e) {
              console.error(e);
              console.error(e.stack);
            }
          }
        }
      },
      payment: function (setting) {
        setting = setting || {};
        var walletElm = document.getElementById(OffAmazonPayments.Widgets.getWalletElmId());
        var walletNode = createNode(walletElm).styles(getWidgetsStyle(setting.widgetsStyle));

        var updateButton = getUpdateButton(setting.updateButtonStyle, walletContent.getUpdateButtonId());

        walletNode.setUpdateButton = function (updateButton) {
          walletNode.parts(createNode('div').text('Amazon Pay').styles({
            fontWeight: 'bold',
          }).attrs({
            id: walletContent.getDescriptorId(),
            class: walletContent.className()
          }), updateButton.attrs({
            class: walletContent.className()
          }));
        }
        return {
          show: function (checkoutSessionId) {
            walletNode.setUpdateButton(updateButton);
            walletContent.checkoutSessionId = checkoutSessionId;
            if (setting.getCheckoutSessionUrl) {
              loading.show(walletNode);
              walletContent.invisible();

              if (!setting.payOnly)
                return;

              try {
                var postParam = JSON.stringify({
                  "checkoutSessionId": checkoutSessionId
                });
                post(setting.getCheckoutSessionUrl).request(postParam).output(function (response) {
                  loading.hide();
                  walletContent.visible();
                  if (response.hasOwnProperty('paymentPreferences') && response.paymentPreferences[0] && response.paymentPreferences[0].hasOwnProperty('paymentDescriptor')) {
                      walletContent.setDescriptorText(response.paymentPreferences[0].paymentDescriptor);
                  }
                }).exec();
              } catch (e) {
                console.error(e);
                console.error(e.stack);
              }
            }
          }
        }
      }
    }

    function getWidgetsStyle(styleObj) {
      return styleObj || {
        border: '1px solid #bbb',
        borderRadius: '6px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 10px 0 10px',
        position: 'relative' //TODO
      };
    }

    function getUpdateButton(styleObj, domId) {
      var updateButtonStyle = styleObj || {
        display: 'block',
        position: 'absolute',
        top: '10px',
        right: '10px',
        fontSize: '1rem',
        padding: '.375rem .75rem',
        textAlign: 'center',
        lineHeight: '1.5',
        borderRadius: '.25rem',
        color: '#fff',
        background: '#6c757d',
      }
      return createNode('button').styles(updateButtonStyle).attrs({
        id: domId,
        type: 'button'
      }).text(msgs[region].buttonValue); //TODO translate this button message
    }
  })();
  /** functions */
  // generate node
  function createNode(elem) {
    var element = !!elem && elem.nodeType === 1 ? elem : elem.match(/polygon|svg/) ? document.createElementNS('http://www.w3.org/2000/svg', elem) : document.createElement(elem);
    element.styles = function (styleJson) {
      Object.assign(element.style, styleJson);
      return element;
    };
    element.attrs = function (attrObj) {
      for (var attr in attrObj) {
        var value = attrObj[attr];
        if (/^on[A-Z]/.test(attr)) {
          var eventName = attr.slice(2).toLocaleLowerCase();
          element.addEventListener(eventName, value);
        } else {
          element.setAttribute(attr, value);
        }
      }
      return element;
    };
    element.parts = function () {
      if (arguments && arguments.length > 0) {
        for (var i = 0, len = arguments.length; i < len; ++i) {
          element.appendChild(arguments[i]);
        }
      }
      return element;
    };
    element.text = function (str) {
      if (element.innerText !== undefined) {
        element.innerText = str;
      } else if (element.textContent !== undefined) {
        element.textContent = str;
      }
      return element;
    };
    return element;
  }
  // post request
  function post(url) {
    var _url = url;
    var _request;
    var _output;
    return {
      request: function (obj) {
        _request = obj;
        return this;
      },
      output: function (func) {
        _output = func;
        return this;
      },
      exec: function () {
        if (!(_url && _output && _request)) {
          alert('invalid post pamrameter.');
          _output();
          return;
        }
        var xhr = new XMLHttpRequest();
        xhr.open('POST', _url);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = () => {
          try {
            if (xhr.status === 200) {
              var response = JSON.parse(xhr.response);
              _output(response);
            } else {
              throw new Error(xhr);
            }
          } catch (e) {
            if (e) {
              console.error(e);
              console.error(e.stack);
            }
            _output();
          }
        };
        xhr.onerror = () => {
          _output();
        };
        xhr.send(_request);
      },
    };
  }
  return {
    showButton: function (createCheckoutSessionUrl, buttonParams) {
      amazonPayWidgets.button(createCheckoutSessionUrl, buttonParams);
    },
    getReturnUrl: function () {
      var returnUrl = amazon.Login.getReturnUrl();
      return returnUrl.match(/http/) ? returnUrl : window.location.origin + '/' + returnUrl;
    },
    getLoginOptions: function () {
      return OffAmazonPayments.getLoginOptions();
    },
    getClientId: function () {
      return OffAmazonPayments.getClientId();
    },
    getCheckoutSessionId: (function () {
      var amazonCheckoutSessionId = null;
      return function () {
        return amazonCheckoutSessionId || (decodeURIComponent(
          (new RegExp('[?|&amp;|#]amazonCheckoutSessionId=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ''])[1].replace(/\+/g, '%20')) || null)
      }
    })(),
    showAddress: function (getCheckoutSessionUrl, widgetsStyle, updateButtonStyle) {
      amazonPayWidgets.address({
        widgetsStyle: widgetsStyle,
        updateButtonStyle: updateButtonStyle
      }).show(getCheckoutSessionUrl, this.getCheckoutSessionId());
      return {
        showPayment: function (widgetsStyle, updateButtonStyle) {
          amazonPayWidgets.payment({
            widgetsStyle: widgetsStyle,
            updateButtonStyle: updateButtonStyle,
            getCheckoutSessionUrl: getCheckoutSessionUrl
          }).show(amazonpayV2Converter.getCheckoutSessionId());
        }
      }
    },
    showPayment: function (getCheckoutSessionUrl, widgetsStyle, updateButtonStyle) {
      amazonPayWidgets.payment({
        widgetsStyle: widgetsStyle,
        updateButtonStyle: updateButtonStyle,
        getCheckoutSessionUrl: getCheckoutSessionUrl,
        payOnly: true
      }).show(this.getCheckoutSessionId());
    }
  };
})();