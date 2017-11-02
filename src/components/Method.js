import React, {Component} from 'react';
import './Method.sass';
import axios from 'axios/index';
import Request from './request';


const Response = (props) => {
    return <div className="message">
        <h4 className="message__title">Response</h4>

        {props.fields.map((f) =>
            <label className="field__label" htmlFor={f.name}>{f.name} = {f.number} (f.type_id)</label>

        )}
    </div>;
};


class Method extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            expanded: false,
            result: '',
            error: '',
        };

    }
    onHeadingClick() {
        this.setState({
            expanded: !this.state.expanded,
        })
    }
    handleInvokeMethod(args) {
        this.setState({
            error: '',
            response: '',
            loading: true,
        });

        axios.post('/api/invoke', {
            package_name: this.props.package_name,
            service_name: this.props.service_name,
            method_name: this.props.name,
            grpc_args: args,
        })
            .then((resp) => {
                this.setState({
                    result: resp.data.data,
                    loading: false,
                });
            })
            .catch((error) => {
                this.setState({
                    error: error.response.data.error,
                    loading: false,
                });
            })
    }
    render() {
        return <div className={`method ${this.state.loading ? 'method--loading' : ''}`}>
            <div className="method__heading" onClick={this.onHeadingClick.bind(this)}>
                <h4 className="method__name"> {this.props.name} <i className={this.state.expanded ? '' : 'fa fa-angle-down'}/></h4>
            </div>

            <div className="method__body" style={{display: this.state.expanded ? 'block' : 'none'}}>
                <Request {...this.props.types[this.props.in]} types={this.props.types} enums={this.props.enums} onInvokeMethod={this.handleInvokeMethod.bind(this)}/>
                {this.state.error ?
                    <div class="method__error">{this.state.error}</div> : null}
                {this.state.result ?
                    <pre className="method__result">{JSON.stringify(this.state.result, null, 4)}</pre> : null}
                <Response {...this.props.types[this.props.out]} types={this.props.types} enums={this.props.enums}/>
            </div>
        </div>
    }
}

export default Method;