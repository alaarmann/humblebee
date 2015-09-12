Humblebee
=========

A general purpose FiniteStateMachine - industrious as a bee.

## Installation

  `npm install humblebee --save`

## Usage

```javascript
  var createHumblebeeFsm = require('humblebee');

  var unlock = function () {
    console.log('unlock() called.');
  };
  var alarm = function () {
    console.log('alarm() called.');
  };
  var thankYou = function () {
    console.log('thankYou() called.');
  };
  var lock = function () {
    console.log('lock() called.');
  };

  var turnstyleFsmSpecification = {
    'states' : {
      'Locked' : {
        'initial' : true,
        'events' : {
          'insertCoin' : {'transition' : 'Unlocked', 'action' : unlock},
          'passThrough' : {'transition' : undefined, 'action' : alarm}
        }
      },
      'Unlocked' : {
        'events' : {
          'insertCoin' : {'transition' : undefined, 'action' : thankYou},
          'passThrough' : {'transition' : 'Locked', 'action' : lock}
        }
      }
    }
  };

  var turnstyleFsm = createHumblebeeFsm(turnstyleFsmSpecification);
  console.log('Initial state is Locked.');
  turnstyleFsm.passThrough();
  console.log('State is still Locked.');
  turnstyleFsm.insertCoin();
  console.log('State is now Unlocked.');
  turnstyleFsm.insertCoin();
  console.log('State is still Unlocked.');
  turnstyleFsm.passThrough();
  console.log('State is now Locked again.');
```

## Tests

  `npm test`


## License

Published under the MIT-License, see [LICENSE-MIT.txt](https://github.com/alaarmann/humblebee/blob/master/LICENSE-MIT.txt) file.


## Contact

Your feedback is appreciated, please e-mail me at [alaarmann@gmx.net](mailto:alaarmann@gmx.net)

## Release History

* 0.1.0 Initial release
