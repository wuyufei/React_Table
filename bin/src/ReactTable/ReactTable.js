(function() {
  var Page, Row, Table, TextCell,
    hasProp = {}.hasOwnProperty;

  Table = React.createClass({
    getInitialState: function() {
      return {
        selectRow: null,
        sortField: null,
        sortDir: "asc",
        currentPage: 0
      };
    },
    getDefaultProps: function() {},
    componentWillMount: function() {},
    componentDidMount: function() {},
    componentDidUpdate: function() {},
    componentWillUnmount: function() {},
    pageChange: function(page) {
      return this.setState({
        currentPage: page
      });
    },
    columnHeaderClickHandler: function(e) {
      var key, sortDir;
      key = e.target.dataset.column;
      if (key === this.state.sortField) {
        sortDir = this.state.sortDir === "asc" ? "desc" : "asc";
      } else {
        sortDir = "asc";
      }
      return this.setState({
        sortField: key,
        sortDir: sortDir,
        currentPage: 0
      });
    },
    renderColumns: function() {
      var addColumnIcon, columnHeaders, k, schema, sortDir, sortField, v;
      sortField = this.state.sortField;
      sortDir = this.state.sortDir;
      schema = this.props.collection.model.prototype.schema;
      addColumnIcon = function(field) {
        if (field === sortField) {
          if (sortDir === "asc") {
            return React.createElement("i", {
              "className": 'glyphicon glyphicon-sort-by-attributes pull-right'
            });
          } else {
            return React.createElement("i", {
              "className": 'glyphicon glyphicon-sort-by-attributes-alt pull-right'
            });
          }
        } else {
          return React.createElement("i", null);
        }
      };
      columnHeaders = (function() {
        var results;
        results = [];
        for (k in schema) {
          if (!hasProp.call(schema, k)) continue;
          v = schema[k];
          results.push(React.createElement("th", {
            "data-column": k,
            "onClick": this.columnHeaderClickHandler
          }, v.title, addColumnIcon(k)));
        }
        return results;
      }).call(this);
      columnHeaders.push(React.createElement("th", null));
      return columnHeaders;
    },
    sortCollection: function() {
      var sortDir, sortField, sortModels;
      if (this.state.sortField != null) {
        sortField = this.state.sortField;
        sortDir = this.state.sortDir;
        return sortModels = this.props.collection.models.sort(function(a, b) {
          a = a.get(sortField);
          b = b.get(sortField);
          if (a > b) {
            if (sortDir === "asc") {
              return 1;
            } else {
              return -1;
            }
          } else if (a === b) {
            return 0;
          } else {
            if (sortDir === "asc") {
              return -1;
            } else {
              return 1;
            }
          }
        });
      } else {
        return sortModels = this.props.collection.models;
      }
    },
    handlerValueChange: function(model, key, value) {
      return model.set(key, value, {
        validate: true
      });
    },
    cellEndEdit: function(model, key, value) {
      var errHandler, that;
      that = this;
      this.editCellError = null;
      errHandler = model.on("invalid", function(model, error) {
        return that.editCellError = error;
      });
      model.set(key, value, {
        validate: true
      });
      return this.editCellError;
    },
    cellBeginEdit: function() {
      if (this.editCellError == null) {
        return true;
      } else {
        return false;
      }
    },
    render: function() {
      debugger;
      var containerStyle, model, pageCollection, rows, sortCollection;
      sortCollection = this.sortCollection();
      pageCollection = sortCollection.slice(this.state.currentPage * 10, +((this.state.currentPage + 1) * 10 - 1) + 1 || 9e9);
      rows = (function() {
        var j, len, results;
        results = [];
        for (j = 0, len = pageCollection.length; j < len; j++) {
          model = pageCollection[j];
          results.push(React.createElement(Row, {
            "key": model.get("id"),
            "model": model,
            "cellBeginEdit": this.cellBeginEdit,
            "cellEndEdit": this.cellEndEdit
          }));
        }
        return results;
      }).call(this);
      containerStyle = {
        marginBottom: 10,
        borderBottomStyle: "none"
      };
      return React.createElement("div", {
        "className": "panel panel-default",
        "style": containerStyle
      }, React.createElement("div", {
        "className": "panel-heading clearfix"
      }, React.createElement("div", {
        "className": "pull-right",
        "data-range": "headerButtons",
        "style": {
          minHeight: 20
        }
      }, React.createElement("button", {
        "className": "btn btn-primary btn-sm",
        "data-command": "add"
      }, React.createElement("span", {
        "className": "glyphicon glyphicon-plus"
      }), " \u65b0\u589e"))), React.createElement("div", {
        "className": "table-responsive"
      }, React.createElement("table", {
        "className": "table table-bordered table-hover",
        "style": {
          borderBottomColor: "rgb(221, 221, 221)",
          borderBottomStyle: "solid",
          borderBottomWidth: 1
        }
      }, React.createElement("thead", null, this.renderColumns()), React.createElement("tbody", null, rows)), React.createElement(Page, {
        "collection": this.props.collection,
        "currentPage": this.state.currentPage,
        "pageChange": this.pageChange.bind(this)
      })));
    }
  });

  Row = React.createClass({
    getInitialState: function() {
      return {
        editCell: null,
        editCellWidth: null
      };
    },
    componentWillMount: function() {},
    cellClick: function(e) {

      /*key = e.target.dataset.field
      width = $(React.findDOMNode(this.refs[key+"-cell"])).outerWidth()
      #@setState
        editCell:key
        editCellWidth:width
       */
    },
    inputClick: function(event) {

      /*event.stopPropagation() */
    },
    inputBlur: function(event) {

      /*@setState
        editCell:null
       */
    },
    componentDidUpdate: function() {

      /*unless @state.editCell is null
        #查找相关组件并执行focus
        React.findDOMNode(this.refs[@state.editCell]).focus()
       */
    },
    render: function() {
      var buttonCell, cells, editCellStyle, k, schema, v;
      schema = this.props.model.schema;
      editCellStyle = {
        width: this.state.editCellWidth,
        padding: 1
      };
      buttonCell = React.createElement("td", {
        "style": {
          width: 220
        }
      }, React.createElement("button", {
        "className": "btn btn-xs btn-info",
        "style": {
          marginRight: 5
        }
      }, React.createElement("span", {
        "className": "glyphicon glyphicon-list"
      }), " \u8be6\u60c5"), React.createElement("button", {
        "className": "btn btn-xs btn-primary",
        "style": {
          marginRight: 5
        }
      }, React.createElement("span", {
        "className": "glyphicon glyphicon-edit"
      }), " \u7f16\u8f91"), React.createElement("div", {
        "className": "btn-group"
      }, React.createElement("button", {
        "className": "btn btn-xs btn-danger"
      }, React.createElement("span", {
        "className": "glyphicon glyphicon-trash"
      }), " \u5220\u9664"), React.createElement("button", {
        "type": "button",
        "className": "btn btn-xs btn-danger  dropdown-toggle",
        "data-toggle": "dropdown",
        "aria-haspopup": "true",
        "aria-expanded": "false"
      }, React.createElement("span", {
        "className": "caret"
      }), React.createElement("span", {
        "className": "sr-only"
      }, "Toggle Dropdown")), React.createElement("ul", {
        "className": "dropdown-menu",
        "role": "menu"
      }, React.createElement("li", null, React.createElement("a", {
        "href": "#"
      }, "\u5ba1\u6838")), React.createElement("li", null, React.createElement("a", {
        "href": "#"
      }, "\u7ea2\u5355")))));
      cells = (function() {
        var results;
        results = [];
        for (k in schema) {
          if (!hasProp.call(schema, k)) continue;
          v = schema[k];
          results.push(React.createElement(TextCell, {
            "value": this.props.model.get(k),
            "fieldKey": k,
            "model": this.props.model,
            "cellBeginEdit": this.props.cellBeginEdit,
            "cellEndEdit": this.props.cellEndEdit
          }));
        }
        return results;
      }).call(this);
      return React.createElement("tr", null, cells, buttonCell);
    }
  });

  TextCell = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    getInitialState: function() {
      return {
        isEdit: false,
        validateError: null
      };
    },
    getDefaultProps: function() {},
    componentWillMount: function() {
      return this.setState({
        value: this.props.value
      });
    },
    componentDidMount: function() {},
    componentWillReceiveProps: function(nextProps) {},
    componentDidUpdate: function() {},
    componentWillUnmount: function() {},
    valueChange: function() {
      var errorMsg;
      errorMsg = this.props.validate(this.props.model, this.props.fieldKey);
      if (this.props.validate(this.props.model, this.props.fieldKey) !== "") {
        return this.setState({
          validateError: errorMsg
        });
      } else {
        return this.setState({
          validateError: null,
          isEdit: false
        });
      }
    },
    cellClick: function() {
      if (this.props.cellBeginEdit()) {
        return this.setState({
          isEdit: true
        });
      }
    },
    inputClick: function(e) {
      e.preventDefault();
      return e.stopPropagation();
    },
    onBlur: function(e) {
      debugger;
      var errorMsg, value;
      value = this.state.value;
      errorMsg = this.props.cellEndEdit(this.props.model, this.props.fieldKey, value);
      if (errorMsg != null) {
        this.setState({
          validateError: errorMsg,
          isEdit: true
        });
        e.preventDefault();
        e.stopPropagation();
        return false;
      } else {
        return this.setState({
          validateError: null,
          isEdit: false
        });
      }
    },
    render: function() {
      var cellStyle, inputStyle;
      cellStyle = {
        padding: 0
      };
      inputStyle = {
        marginBottom: 0
      };
      if (this.state.isEdit) {
        return React.createElement("td", {
          "style": cellStyle
        }, React.createElement("input", {
          "style": inputStyle,
          "ref": "input",
          "type": 'text',
          "valueLink": this.linkState("value"),
          "onBlur": this.onBlur,
          "className": 'form-control'
        }));
      } else {
        return React.createElement("td", {
          "onClick": this.cellClick
        }, this.state.value);
      }
    },
    componentDidMount: function() {
      debugger;
      var td;
      td = this.getDOMNode();
      return this.width = $(td).outerWidth();
    },
    componentDidUpdate: function() {
      var input;
      if (this.state.isEdit) {
        input = $(React.findDOMNode(this.refs.input));
        $(this.getDOMNode()).width(this.width);
        if (this.state.validateError != null) {
          input.popover({
            content: this.state.validateError[this.props.fieldKey],
            placement: "auto"
          });
          input.focus().popover("show");
        }
        return setTimeout(function() {
          return input.focus();
        }, 0);
      }
    }
  });

  Page = React.createClass({
    pageClick: function(e) {
      debugger;
      var info, pageLength, pageNum;
      e.preventDefault();
      e.stopPropagation();
      pageLength = Math.ceil(this.props.collection.length / 10) - 1;
      info = e.target.dataset.number;
      if (info === "prev") {
        pageNum = this.props.currentPage - 1;
      } else if (info === "next") {
        pageNum = this.props.currentPage + 1;
      } else {
        pageNum = parseInt(info);
      }
      if (pageNum < 0) {
        pageNum = 0;
      }
      if (pageNum > pageLength) {
        pageNum = pageLength;
      }
      if (pageNum !== this.props.currentPage) {
        return this.props.pageChange(pageNum);
      }
    },
    getPageArray: function() {
      debugger;
      var currPage, j, l, length, numbers, pages, results, results1;
      length = Math.ceil(this.props.collection.length / 10) - 1;
      currPage = this.props.currentPage;
      pages = [];
      numbers = (function() {
        results = [];
        for (var j = 0; 0 <= length ? j <= length : j >= length; 0 <= length ? j++ : j--){ results.push(j); }
        return results;
      }).apply(this);
      if (length > 0) {
        if (length > 10) {
          if (this.props.currentPage >= 4) {
            pages.push(0);
            pages.push("......");
            if (currPage < length - 4) {
              pages = pages.concat(numbers.slice(currPage - 2, +(currPage + 2) + 1 || 9e9));
              debugger;
              if (currPage + 2 < length - 5) {
                pages.push("......");
              }
            }
            pages = pages.concat(numbers.slice(-5));
          } else {
            pages = pages.concat(numbers.slice(0, 5));
            pages.push("......");
            pages = pages.concat(numbers.slice(length - 4));
          }
        } else {
          pages = (function() {
            results1 = [];
            for (var l = 0; 0 <= length ? l <= length : l >= length; 0 <= length ? l++ : l--){ results1.push(l); }
            return results1;
          }).apply(this);
        }
      }
      return pages;
    },
    render: function() {
      var i, length, pageArray, pages;
      pageArray = this.getPageArray();
      length = Math.ceil(this.props.collection.length / 10) - 1;
      pages = (function() {
        var j, len, results;
        results = [];
        for (j = 0, len = pageArray.length; j < len; j++) {
          i = pageArray[j];
          results.push(React.createElement("li", {
            "className": (this.props.currentPage === i ? "active" : void 0)
          }, (i === "......" ? React.createElement("span", null, "......") : React.createElement("a", {
            "href": "#",
            "data-number": i,
            "onClick": this.pageClick
          }, i + 1))));
        }
        return results;
      }).call(this);
      return React.createElement("nav", null, React.createElement("ul", {
        "className": "pagination",
        "style": {
          marginTop: 10,
          marginLeft: 5,
          marginBottom: 5
        }
      }, React.createElement("li", {
        "className": (this.props.currentPage === 0 ? "disabled" : void 0)
      }, React.createElement("a", {
        "href": "#",
        "data-number": "prev",
        "onClick": this.pageClick
      }, "\u4e0a\u4e00\u9875")), pages, React.createElement("li", {
        "className": (this.props.currentPage === length ? "disabled" : void 0)
      }, React.createElement("a", {
        "href": "#",
        "data-number": "next",
        "onClick": this.pageClick
      }, "\u4e0b\u4e00\u9875"))));
    }
  });

  window.BackboneTable = Table;

}).call(this);
