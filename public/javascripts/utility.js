function $(s, c) {
  if (typeof s !== "string") { return s; }
  c = c || document;

  if (typeof c === "string") {
    c = $(c);
  }
  return c.querySelector(s);
}

$.get = function(url, type) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    if(type) xhr.responseType = type;
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        if(xhr.readyState === 4) resolve(xhr.response);
      } else {
        reject(status);
      }
    };
    xhr.send();
  });
};



$.post = function(url, params) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("Content-length", params.length);
    xhr.setRequestHeader("Connection", "close");

    xhr.onreadystatechange = function() {
      if(xhr.status === 200)
        if(xhr.readyState === 4)
          resolve(xhr.responseText);
      else
        if(xhr.status !== 200)
          reject(xhr)
    };
    xhr.send(params);
  });
};

function Mustache (template, data) {
  var fields = [],
  re = /{{([^}}]+)}}/g
  , text;

  while ((text = re.exec(template)) !== null) {
    fields.push(text[1]);
  }

  for (var i = 0; i < fields.length; ++i) {
    template = template.replace(new RegExp("{{" + fields[i] + "}}"), data[fields[i]]);
  }

  return template;
}
