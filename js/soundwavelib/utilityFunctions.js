function keyToNote(keyValue) {
  
    var KEY_MAP = 
    {
      // fourth row
      49 : {letter : '1', value : 24}, 50 : {letter : '2', value : 22}, 51 : {letter : '3', value : 20}, 52 : {letter : '4', value : 18}, 53 : {letter : '5', value : 16},  54 : {letter : '6', value : 14},  
      55 : {letter : '7', value : 12},  56 : {letter : '8', value : 10},  57 : {letter : '9', value : 8},  48 : {letter : '0', value : 6},  189 : {letter : '-', value : 4},  187 : {letter : '=', value : 2},
      // third row
      81 : {letter : 'Q', value : 23}, 87 : {letter : 'W', value : 21}, 69 : {letter : 'E', value : 19}, 82 : {letter : 'R', value : 17}, 84 : {letter : 'T', value : 15},  89 : {letter : 'Y', value : 13},  
      85 : {letter : 'U', value : 11}, 73 : {letter : 'I', value : 9},  79 : {letter : 'O', value : 7},  80 : {letter : 'P', value : 5},  219 : {letter : '\[', value : 3},  221 : {letter : '\]', value : 1}, 
      // second row
      65 : {letter : 'A', value : 0}, 83 : {letter : 'S', value : -2}, 68 : {letter : 'D', value : -4}, 70 : {letter : 'F', value : -6}, 71 : {letter : 'G', value : -8},  72 : {letter : 'H', value : -10},  
      74 : {letter : 'J', value : -12},  75 : {letter : 'K', value : -14},  76 : {letter : 'L', value : -16},  186 : {letter : ';', value : -18},  222 : {letter : '\'', value : -20},  220 : {letter : '\\', value : -22},
      // first row
      90 : {letter : 'Z', value : -1}, 88 : {letter : 'X', value : -3}, 67 : {letter : 'C', value : -5}, 86 : {letter : 'V', value : -7}, 66 : {letter : 'B', value : -9},  78 : {letter : 'N', value : -11},  
      77 : {letter : 'M', value : -13},  188 : {letter : '\,', value : -15},  190 : {letter : '\.', value : -17},  191 : {letter : '\/', value : -19},  16 : {letter : 'SHIFT', value : -21},  38 : {letter : '', value : -23},
    };
				
  return KEY_MAP[keyValue].value;
    
}