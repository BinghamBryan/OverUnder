trimInput = function(val) {
  return val.replace(/^\s*|\s*$/g, "");
};

isValidPassword = function(val, field) {
    if (val.length >= 6) {
      return true;
    } else {
      //Session.set('displayMessage', 'Error &amp; Too short.')
      return false; 
    }
  };

