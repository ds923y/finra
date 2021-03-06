


var server_ajax = server_ajax || {};

/**
 * Client ID of the application (from the APIs Console).
 * @type {string}
 */
server_ajax.CLIENT_ID =
    '107009150422-1hvre2966ihf34ji4v15e0526lv9dt0t.apps.googleusercontent.com';

/**
 * Scopes used by the application.
 * @type {string}
 */
server_ajax.SCOPES =
    'https://www.googleapis.com/auth/userinfo.email';

/**
 * Whether or not the user is signed in.
 * @type {boolean}
 */
server_ajax.signedIn = false;



server_ajax.getNumbers = function(phonenumber, id, setter) {
     gapi.client.finra.telephoneAlphaNumerics.getNumbers({'num':phonenumber, 'id': id}).execute(
        function(resp) {
            if (!resp.code) {
                setter(resp.output,resp.combinations, resp.phoneNumber, resp.page);
            } else {
                window.alert(resp.message);
            }
        });
};



/**
 * Greets the current user via the API.
 */
server_ajax.authedGreeting = function(id) {
    gapi.client.finra.telephoneAlphaNumerics.authed().execute(
        function(resp) {
            server_ajax.print(resp);
        });
};


var Pagination = React.createClass({
    getInitialState: function() {
        return {
            startIndex: 1
        };
    },
    handleLeftArrow: function(event) {
        if(this.state.startIndex > 1){
            var sr = this.state.startIndex - 1;
            this.setState({startIndex: sr});
        }
    },
    handleRightArrow: function(event) {
        if(this.state.startIndex + 5 < this.props.page.numpages){
            var sr = this.state.startIndex + 1;
            this.setState({startIndex: sr});
        }
    },
    getfmtedtext: function(str){
        str = str.replace(/\D/g,'');
        var fmts = [/^(\d{3})(\d{3})(\d{4})$/g, /^(\d{3})(\d{4})$/g];
        fmts = fmts.reduce(function(prev, elm){
            var v = elm.exec(str);

            if(v == null){
                return prev;
            }
            switch(v.length){
                case 3:
                    return {display:v[1] + '-' + v[2], value: v[1] + v[2]};
                case 4:
                    return {display:"(" + v[1] + ")" + " " + v[2] + '-' + v[3], value: v[1] + v[2] + v[3]};
            }

        }, null);

        return fmts == null ? {display:str, value:str} : fmts;
    },
    componentWillReceiveProps: function(nextProps) {
        if(this.props.page.combinations == 0){
            this.setState({
                startIndex: 1
            });
        }
    },
    render: function() {
        if(this.props.page.combinations == 0)
            return null;
        var rows = [];
        var startIdx = this.state.startIndex;
        var endIdx = Math.min(this.props.page.numpages, startIdx + 5);
        if(endIdx == 0){
            return null;
        }

        var i = startIdx;
        rows.push(<LeftArrow key={-1} decrement={this.handleLeftArrow}/>);
        for (; i < endIdx; i++) {
            var content = {'page_num':i, 'active':this.props.page.active, 'indexChanged':this.props.page.indexChanged, 'number':this.props.page.phoneNumber};
            rows.push(<NumberItem key={i} pagination={content}/>);
        }
        rows.push(<RightArrow key={i} increment={this.handleRightArrow}/>);
        return <div className="content"><div>{this.props.page.output}</div><nav><ul className="pagination">{rows}</ul></nav></div>;
    }
});

var LeftArrow = React.createClass({
    render:function(){
        return <li className="page-item" onClick={this.props.decrement}><a className="page-link" href="#">{'\u00ab'}</a></li>;
    }
});

var RightArrow = React.createClass({
    render:function(){
        return <li className="page-item" onClick={this.props.increment}><a className="page-link" href="#">{'\u00bb'}</a></li>;
    }
});

var NumberItem = React.createClass({
    handleNumberClick: function(event) {
        var sr = event.currentTarget.dataset.id - 1;
        //this.props.pagination.changeActive(sr);
        this.props.pagination.indexChanged(this.props.pagination.number, true, sr);
    },//5129716510
    render:function(){
        var pg = this.props.pagination.page_num;
        var clName = ((this.props.pagination.active + 1) == pg) ?  "page-item active" : "page-item";
        return <li className={clName} data-id={pg} onClick={this.handleNumberClick}><a className="page-link" href="#">{pg}</a></li>;
    }
});

var PhoneNumberInput = React.createClass({
    getFmtedPhoneNum: function(str){
        str = str.replace(/\D/g,'');
        var fmts = [/^(\d{3})(\d{3})(\d{4})$/g, /^(\d{3})(\d{4})$/g];
        fmts = fmts.reduce(function(prev, elm){
            var v = elm.exec(str);

            if(v == null){
                return prev;
            }
            switch(v.length){
                case 3:
                    return {display:v[1] + '-' + v[2], value: v[1] + v[2]};
                case 4:
                    return {display:"(" + v[1] + ")" + " " + v[2] + '-' + v[3], value: v[1] + v[2] + v[3]};
            }
        }, null);

        return fmts == null ? {display:str, value:str} : fmts;
    },disableEnter: function(keyevent){
        keyevent.preventDefault();
        return false;
    },handleChange: function(event) {
        var fmted = this.getFmtedPhoneNum(event.target.value);
        try {
            var phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
            var phoneNumber = phoneUtil.parse(fmted.value, 'US');
            if(fmted.value.length == 7 && phoneUtil.isPossibleNumber(phoneNumber) || fmted.value.length == 10 && phoneUtil.isValidNumber(phoneNumber)){
                this.props.phone.numberCng(fmted.display, true, 0);
            }else{
                this.props.phone.numberCng(fmted.display, false, 0);
            }
        }
        catch(err) {
            this.props.phone.numberCng(fmted.display, false, 0);
        }
    }, render:function(){
        var gliphiconUI = '';
        var feedbackUI = '';
        if(this.props.phone.phoneNumber == ""){
            gliphiconUI = '';
            feedbackUI = '';
        } else if(this.props.phone.valid) {
            gliphiconUI = 'glyphicon glyphicon-ok form-control-feedback';
            feedbackUI = 'form-group has-success has-feedback';
        } else {
            gliphiconUI = 'glyphicon glyphicon-remove form-control-feedback';
            feedbackUI = 'form-group has-error has-feedback';
        }

        var opts = {};
        if (!this.props.phone.signedIn) {
            opts['disabled'] = 'disabled';
        }

        return <form className="form-inline" role="form" onSubmit={this.disableEnter}><div className={feedbackUI}><div className="input-group">
            <input  type="tel" maxLength="10" className="form-control" placeholder="Phone Number" aria-describedby="basic-addon2" value={this.props.phone.phoneNumber} onChange={this.handleChange} {...opts}/>
            <span className={gliphiconUI}></span></div></div></form>;
    }
});

var FormPages = React.createClass({
    getInitialState: function() {
        return {signedIn: false,
                phoneNumber: '',
                valid: false,
                combinations:0,
                output:'',
                active:0,
                waiting:false,
                timer:null};
    },
    userAuthed : function() {
        var self = this;
        var request = gapi.client.oauth2.userinfo.get().execute(function(resp) {
            if (!resp.code) {
                self.setState({signedIn: true});
            }
        });
    },
    signin : function(mode, callback) {
        gapi.auth.authorize({client_id: server_ajax.CLIENT_ID,
                scope: server_ajax.SCOPES, immediate: mode},
            callback);
    },
    auth : function() {
        if (!this.state.signedIn) {
             this.signin(false, this.userAuthed);
        } else {
            //server_ajax.signedIn = false;
            this.setState({signedIn: false,
                phoneNumber: '',
                valid: false,
                combinations:0,
                output:'',
                active:0,
                waiting:false,
                timer:null});
        }
    },
    getFmtOutput: function(str){
        //str = str.replace(/\D/g,'');
        var fmts = [/^(\w{3})(\w{3})(\w{4})$/g, /^(\w{3})(\w{4})$/g];
        fmts = fmts.reduce(function(prev, elm){
            var v = elm.exec(str);

            if(v == null){
                return prev;
            }
            switch(v.length){
                case 3:
                    return v[1] + ' ' + v[2];
                case 4:
                    return v[1] + ' ' + v[2] + ' ' + v[3];
            }

        }, null);

        return fmts == null ? str : fmts;
    },
    changeOutput: function(output, newval, phoneNumber, page) {
        if(phoneNumber == this.state.phoneNumber.replace(/\D/g,'') && page == this.state.active) {
            var fmt = this.getFmtOutput;
            var out = output.map(function (obj, index) {
                return <div key={index}>{fmt(obj)}</div>;
            });

            this.setState({output: out, combinations: newval});
            clearTimeout(this.state.timer);
            this.setState({waiting:false});
        }
    }, componentDidMount: function(){
        this.signin(true, this.userAuthed);
        return {};
    },
    handleNumberIndexChange: function(phoneNumber, newState, active) {
        this.setState({valid: newState, phoneNumber: phoneNumber});
        if(newState) {
            this.setState({active:active});
            //server_ajax.getCount(phoneNumber, this.changeCombinations);
            var str = phoneNumber.replace(/\D/g,'');
            server_ajax.getNumbers(str, active, this.changeOutput);
            var self = this;
            var timer = setTimeout(function(){
                self.setState({waiting:true});
            }, 100);
            this.setState({timer:timer});
        }else{
            this.setState({combinations:0, output:''});
            clearTimeout(this.state.timer);
            this.setState({waiting:false});
        }
    },
    render:function(){
        var phoneprops = {'phoneNumber':this.state.phoneNumber, 'valid':this.state.valid, 'numberCng':this.handleNumberIndexChange, 'signedIn':this.state.signedIn, active:this.state.active};
        var totalPages = this.state.combinations/10 + Math.sign(this.state.combinations%10);
        var paginationprops = {numpages:totalPages, phoneNumber:this.state.phoneNumber,
            combinations:this.state.combinations, output: this.state.output, indexChanged:this.handleNumberIndexChange, active:this.state.active};
        var paginationCount = (this.state.combinations > 0) ? <p>Total number of combinations: {this.state.combinations}</p> : <div/>;
        var authText = (this.state.signedIn) ? 'Sign Out': 'Sign In';
        var spinnerSignal = (this.state.waiting) ? "fa fa-refresh fa-spin": "";

        return <div className="container">
            <div className="col-lg-4">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <div className="panel-title"><span>Telephone Alpha-Numerics{'\u00a0'}</span><i className={spinnerSignal}></i></div>
                        </div>
                        <div className="panel-body">
                            <PhoneNumberInput phone={phoneprops}/>
                            {paginationCount}
                            <Pagination page={paginationprops}/>

                            </div>
                        <div className="panel-footer"><a href="javascript:void(0);" onClick={this.auth}>{authText}</a></div>
                    </div>
                </div>
            <div className="col-lg-8"/>
        </div>;
    }
});


server_ajax.reactDom = function() {
    ReactDOM.render(<FormPages/>,
        document.getElementById('container')
    );
}

/**
 * Initializes the application.
 * @param {string} apiRoot Root of the API's path.
 */
server_ajax.init = function(apiRoot) {
    var apisToLoad;
    var callback = function() {
        if (--apisToLoad == 0) {
            server_ajax.reactDom();
        }
    }

    apisToLoad = 2; // must match number of calls to gapi.client.load()
    gapi.client.load('finra', 'v1', callback, apiRoot);
    gapi.client.load('oauth2', 'v2', callback);
};

function init() {
    server_ajax.init('//' + window.location.host + '/_ah/api');
}

window['init'] = init;




