function isHormuudNumber(phone) {
    if (!phone) return false;
    phone = phone.trim().replace(/\D/g, ''); // Remove all non-digit characters
  
    // Now check for both patterns:
    // international starts with 25261
    // local starts with 770 (remove leading zero for local)
    if (phone.startsWith('25261')) {
      return true;
    }
  
    if (phone.startsWith('25277')) {
      return true;
    }
  
    return false;
  }
  
  module.exports = { isHormuudNumber };
  