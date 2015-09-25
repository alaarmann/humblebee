/*
 * test.js
 * UnitTests for Humblebee FiniteStateMachine module
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/
/*global require, exports */

var createFsm = require('../main');

var createFsmSpecification = function () {
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
          'insertCoin' : {
            'transition' : 'Unlocked',
            'action' : unlock
          },
          'passThrough' : {
            'transition' : undefined,
            'action' : alarm
          }
        }
      },
      'Unlocked' : {
        'events' : {
          'insertCoin' : {
            'transition' : undefined,
            'action' : thankYou
          },
          'passThrough' : {
            'transition' : 'Locked',
            'action' : lock
          }
        }
      }
    }
  };

  return turnstyleFsmSpecification;
};

exports['createFsm'] = function (test) {
  var turnstyleFsmSpecification = createFsmSpecification();
  var turnstyleState = createFsm(turnstyleFsmSpecification);
  var initialStateId = 'Locked';
  test.equal(turnstyleState.getId(), initialStateId, 'Initial state is ' + initialStateId);
  test.done();
};

exports['statesAndTransitions'] = function (test) {
  var turnstyleFsmSpecification = createFsmSpecification();
  var turnstyleState = createFsm(turnstyleFsmSpecification);
  test.equal(turnstyleState.getId(), 'Locked');
  turnstyleState.passThrough();
  test.equal(turnstyleState.getId(), 'Locked');
  turnstyleState.insertCoin();
  test.equal(turnstyleState.getId(), 'Unlocked');
  turnstyleState.insertCoin();
  test.equal(turnstyleState.getId(), 'Unlocked');
  turnstyleState.passThrough();
  test.equal(turnstyleState.getId(), 'Locked');


  test.done();
};

exports['actions'] = function (test) {
  var turnstyleFsmSpecification = createFsmSpecification();
  var isUnlockCalled ;
  var isAlarmCalled ;
  var isThankYouCalled ;
  var isLockCalled ;
  var resetIndicators = function () {
    isUnlockCalled = false;
    isAlarmCalled = false;
    isThankYouCalled = false;
    isLockCalled = false;
  };

  var unlock = function () {
    isUnlockCalled = true ;
  };
  var alarm = function () {
    isAlarmCalled = true ;
  };
  var thankYou = function () {
    isThankYouCalled = true ;
  };
  var lock = function () {
    isLockCalled = true ;
  };

  turnstyleFsmSpecification['states']['Locked']['events']['insertCoin']['action'] = unlock;
  turnstyleFsmSpecification['states']['Locked']['events']['passThrough']['action'] = alarm;
  turnstyleFsmSpecification['states']['Unlocked']['events']['insertCoin']['action'] = thankYou;
  turnstyleFsmSpecification['states']['Unlocked']['events']['passThrough']['action'] = lock;

  var turnstyleState = createFsm(turnstyleFsmSpecification);

  test.expect(4);

  resetIndicators();
  turnstyleState.passThrough();
  test.ok(isAlarmCalled && !(isUnlockCalled || isThankYouCalled || isLockCalled));

  resetIndicators();
  turnstyleState.insertCoin();
  test.ok(isUnlockCalled && !(isAlarmCalled || isThankYouCalled || isLockCalled));

  resetIndicators();
  turnstyleState.insertCoin();
  test.ok(isThankYouCalled && !(isAlarmCalled || isUnlockCalled || isLockCalled));

  resetIndicators();
  turnstyleState.passThrough();
  test.ok(isLockCalled && !(isAlarmCalled || isUnlockCalled || isThankYouCalled));

  test.done();
};

exports['modifySpecAfter'] = function (test) {
  var turnstyleFsmSpecification = createFsmSpecification();
  var turnstyleState = createFsm(turnstyleFsmSpecification);

  // modification after creation must not have any influence on fsm
  turnstyleFsmSpecification.states.Locked = {};
  turnstyleFsmSpecification.states.Unlocked = {};


  test.equal(turnstyleState.getId(), 'Locked');
  turnstyleState.passThrough();
  test.equal(turnstyleState.getId(), 'Locked');
  turnstyleState.insertCoin();
  test.equal(turnstyleState.getId(), 'Unlocked');
  turnstyleState.insertCoin();
  test.equal(turnstyleState.getId(), 'Unlocked');
  turnstyleState.passThrough();
  test.equal(turnstyleState.getId(), 'Locked');


  test.done();
};

exports['passThroughArguments'] = function (test) {
  var turnstyleFsmSpecification = createFsmSpecification();

  var alarm = function () {
    test.equal(arguments.length, 2);
    test.equal(arguments[0], 'hastily');
    test.equal(arguments[1], 'climbing');
    console.log('alarm(): someone is ' + arguments[0] + ' ' + arguments[1] + ' to pass through');
  };

  turnstyleFsmSpecification['states']['Locked']['events']['passThrough']['action'] = alarm;

  var turnstyleState = createFsm(turnstyleFsmSpecification);
  test.equal(turnstyleState.getId(), 'Locked');
  turnstyleState.passThrough('hastily', 'climbing');
  test.equal(turnstyleState.getId(), 'Locked');
  turnstyleState.insertCoin(203, 'Euro');
  test.equal(turnstyleState.getId(), 'Unlocked');


  test.done();
};

