Table = React.createClass
    #mixins:[RowMixin]
    #状态初始化
    getInitialState:->
      selectRow:null
      sortField:null
      sortDir:"asc"
      currentPage:0
    getDefaultProps:->
    #组件加载前-执行一次
    componentWillMount:->
    #组件加载后--执行一次
    componentDidMount:->
    #组件每次更新后执行
    componentDidUpdate:->
    #组件移除前调用
    componentWillUnmount:->
    pageChange:(page)->
      @setState
        currentPage:page
    #排序
    columnHeaderClickHandler:(e)->
      key = e.target.dataset.column
      if key is @state.sortField
        sortDir = if @state.sortDir is "asc" then "desc" else "asc"
      else
        sortDir = "asc"
      @setState
          sortField:key
          sortDir:sortDir
          currentPage:0

    renderColumns:->
      sortField = @state.sortField
      sortDir = @state.sortDir
      schema = @props.collection.model::schema
      addColumnIcon = (field)->
        if field is sortField
          if sortDir is "asc"
            <i className='glyphicon glyphicon-sort-by-attributes pull-right' />
          else
            <i className='glyphicon glyphicon-sort-by-attributes-alt pull-right'/>
        else
          <i/>
      columnHeaders = for own k,v of schema
              <th data-column={k} onClick={@columnHeaderClickHandler}>
                {v.title}{addColumnIcon(k)}
              </th>
      columnHeaders.push(<th></th>)
      columnHeaders

    sortCollection:->
      if @state.sortField?
        sortField = @state.sortField
        sortDir = @state.sortDir
        sortModels = @props.collection.models.sort (a,b)->
          a = a.get(sortField)
          b = b.get(sortField)
          if a>b
            if sortDir is "asc" then 1 else -1
          else if a is b
            0
          else
            if sortDir is "asc" then -1 else 1
      else
        sortModels = @props.collection.models
    handlerValueChange:(model,key,value)->
      model.set key,value,validate:true
    cellEndEdit:(model,key,value)->
      that = @
      @editCellError = null
      errHandler = model.on "invalid",(model, error)->
        that.editCellError = error
      model.set key,value,validate:true
      @editCellError

    cellBeginEdit:()->
      unless @editCellError? then true else false
    render:->
      debugger
      sortCollection = @sortCollection()
      pageCollection = sortCollection[@state.currentPage*10..(@state.currentPage+1)*10-1]
      rows = for model in pageCollection
              <Row key={model.get("id")} model={model} cellBeginEdit={@cellBeginEdit} cellEndEdit={@cellEndEdit}/>
      containerStyle =
                    marginBottom:10
                    borderBottomStyle:"none"
      <div className="panel panel-default" style={containerStyle}>
          <div className="panel-heading clearfix">
            	<div className="pull-right" data-range="headerButtons" style={{minHeight:20}}>
                <button className="btn btn-primary btn-sm" data-command="add"><span className="glyphicon glyphicon-plus"></span> 新增</button>
              </div>
          </div>
          <div className="table-responsive" >
            	<table className="table table-bordered table-hover" style={{borderBottomColor:"rgb(221, 221, 221)",borderBottomStyle:"solid",borderBottomWidth:1}}>
            		<thead>{@renderColumns()}</thead>
            		<tbody>{rows}</tbody>
            	</table>
              <Page collection={@props.collection} currentPage={@state.currentPage} pageChange={@pageChange.bind(@)}/>
            </div>
      </div>

Row = React.createClass
  getInitialState:->
    editCell:null
    editCellWidth:null
  componentWillMount:->
  cellClick:(e)->
    ###key = e.target.dataset.field
    width = $(React.findDOMNode(this.refs[key+"-cell"])).outerWidth()
    #@setState
      editCell:key
      editCellWidth:width###
  inputClick:(event)->
    ###event.stopPropagation()###

  inputBlur:(event)->
    ###@setState
      editCell:null###
  componentDidUpdate:->
    ###unless @state.editCell is null
      #查找相关组件并执行focus
      React.findDOMNode(this.refs[@state.editCell]).focus()###
  render:->
    schema = @props.model.schema
    editCellStyle =
      width:@state.editCellWidth
      padding:1
    buttonCell = <td style={{width:220}}>
                    <button className="btn btn-xs btn-info" style={{marginRight:5}} >
                      <span className="glyphicon glyphicon-list"></span> 详情
                    </button>
                    <button className="btn btn-xs btn-primary" style={{marginRight:5}}>
                      <span className="glyphicon glyphicon-edit"></span> 编辑
                    </button>
                    <div className="btn-group">
                      <button className="btn btn-xs btn-danger">
                        <span className="glyphicon glyphicon-trash"></span> 删除
                      </button>
                      <button type="button" className="btn btn-xs btn-danger  dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span className="caret"></span>
                        <span className="sr-only">Toggle Dropdown</span>
                      </button>
                        <ul className="dropdown-menu" role="menu">
                          <li><a href="#" >审核</a></li>
                          <li><a href="#" >红单</a></li>
                        </ul>
                    </div>
                </td>
    cells = for own k,v of schema
        <TextCell value={@props.model.get(k)} fieldKey={k} model={@props.model} cellBeginEdit={@props.cellBeginEdit} cellEndEdit={@props.cellEndEdit}/>
      #if @state.editCell is k
    <tr>{cells}{buttonCell}</tr>

TextCell = React.createClass
    mixins:[React.addons.LinkedStateMixin]
    getInitialState:->
      isEdit:false
      validateError:null
    getDefaultProps:->
    #组件加载前-执行一次
    componentWillMount:->
      @setState value: @props.value
    #组件加载后--执行一次
    componentDidMount:->
    #组件的属性更改后执行
    componentWillReceiveProps:(nextProps)->
      #this.setState
      #  isEdit:false
    #组件每次更新后执行
    componentDidUpdate:->
    #组件移除前调用
    componentWillUnmount:->
      #注销事件
    valueChange:->
      errorMsg = @props.validate(@props.model,@props.fieldKey)
      if @props.validate(@props.model,@props.fieldKey) isnt ""
        @setState
          validateError:errorMsg
      else
        @setState
          validateError:null
          isEdit:false
    cellClick:->
      ##if @state.errorMsg isnt null
      if @props.cellBeginEdit()
        @setState
          isEdit:true
    inputClick:(e)->
      e.preventDefault()
      e.stopPropagation()
    onBlur:(e)->
      debugger
      value = @state.value
      errorMsg =  @props.cellEndEdit(@props.model,@props.fieldKey,value)
      if errorMsg?
        @setState
          validateError:errorMsg
          isEdit:true
        e.preventDefault()
        e.stopPropagation()
        return false
      else
        @setState
          validateError:null
          isEdit:false
    render:->
      cellStyle =
        padding:0
      inputStyle =
        marginBottom:0
      if @state.isEdit
        <td style={cellStyle}>
           <input style={inputStyle} ref="input" type='text' valueLink={@linkState("value")} onBlur={@onBlur}
             className='form-control' />
        </td>
      else
        <td  onClick={@cellClick}>{@state.value}</td>
    componentDidMount:->
      debugger
      td = @getDOMNode()
      @width = $(td).outerWidth()
    componentDidUpdate:->
      if @state.isEdit
        input = $(React.findDOMNode(this.refs.input))
        $(@getDOMNode()).width(@width)
        if @state.validateError?
          #添加error控件
          #popover = input.data "bs.popover"
          #popover.destroy() if popover?
          input.popover
            content:@state.validateError[@props.fieldKey]
            placement:"auto"
          input.focus().popover("show")
        setTimeout ->
          input.focus()
        ,0


Page = React.createClass
  pageClick:(e)->
    debugger
    e.preventDefault()
    e.stopPropagation()
    pageLength = Math.ceil(@props.collection.length/10)-1
    info = e.target.dataset.number
    if info is "prev"
      pageNum = @props.currentPage-1
    else if info is "next"
      pageNum = @props.currentPage+1
    else
      pageNum = parseInt(info)
    pageNum = 0 if pageNum<0
    pageNum = pageLength if pageNum>pageLength
    if pageNum isnt @props.currentPage
      @props.pageChange(pageNum)
  getPageArray:->
    debugger
    length = Math.ceil(@props.collection.length/10)-1
    currPage = @props.currentPage
    pages = []
    numbers = [0..length]
    if length>0
      if length>10
        if @props.currentPage>=4
          pages.push(0)
          pages.push("......")
          if currPage<length-4
            pages = pages.concat numbers[currPage-2..currPage+2]
            debugger
            pages.push "......" if currPage+2<length-5
          pages = pages.concat numbers[-5..-1]
        else
          pages = pages.concat numbers[0..4]
          pages.push "......"
          pages = pages.concat numbers[length-4..-1]
      else
        pages = [0..length]
    pages

  render:->
    pageArray = @getPageArray()
    length = Math.ceil(@props.collection.length/10)-1
    pages = for i in pageArray
      <li className={if @props.currentPage is i then "active"}>
        {if i is "......" then <span>......</span> else <a href="#" data-number={i} onClick={@pageClick}>{i+1}</a> }
      </li>
    <nav>
      <ul className="pagination" style={{marginTop:10,marginLeft:5,marginBottom:5}}>
        <li className={if @props.currentPage is 0 then "disabled"}><a href="#" data-number="prev" onClick={@pageClick}>上一页</a></li>
        {pages}
        <li className={if @props.currentPage is length then "disabled"}><a href="#" data-number="next" onClick={@pageClick}>下一页</a></li>
      </ul>
    </nav>








window.BackboneTable = Table
###
