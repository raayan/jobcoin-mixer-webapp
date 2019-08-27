import React, {Fragment} from "react";
import {Button} from 'antd';
import Form from "antd/es/form";
import Input from "antd/es/input";
import Icon from "antd/es/icon";
import {Get, Notify} from "../api/method.api";
import {AddressInfo} from "../api/types";
import {AxiosResponse} from "axios";
import {Statistic} from "antd/es";
import {Col, Row} from "antd/es/grid";
import Collapse from "antd/es/collapse";
import {TransactionTable} from "../components/TransactionTable";

function hasErrors(fieldsError: any) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

type Props = {
    form: any,

}

type State = {
    addressInfo?: AddressInfo;
    address?: string;
}

class GetAddressInfoForm extends React.Component<Props, State> {
    componentDidMount() {
        this.props.form.validateFields();
        this.state = {}
    };


    handleSubmit = (e: any) => {
        e.preventDefault();
        this.props.form.validateFields((err: any, values: any) => {
            if (!err) {
                const address = values['address'];
                Get(`api/jobcoin/addresses/${address}`)
                    .then(response => {
                        const axiosResponse = response as AxiosResponse;
                        Notify(axiosResponse, "Retrieved Address Info");
                        const addressInfo = axiosResponse.data as AddressInfo;
                        this.setState({
                            addressInfo: addressInfo,
                            address: address
                        });
                    });
            }
        });
    };

    render() {
        const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;

        const addressError = isFieldTouched('address') && getFieldError('address');

        return (
            <Fragment>
                <Form layout="horizontal" onSubmit={this.handleSubmit}>
                    <Form.Item
                        labelCol={{span: 4}}
                        wrapperCol={{span: 12}}
                        label={"Address"}
                        validateStatus={addressError ? 'error' : ''} help={addressError || ''}
                    >
                        {getFieldDecorator('address', {
                            rules: [{required: true, message: 'Address required!'}],
                        })(
                            <Input prefix={<Icon type="wallet" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                   placeholder="Address"/>
                        )}
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{span: 12, offset: 4}}

                    >
                        <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
                            Get Info
                        </Button>
                    </Form.Item>
                </Form>
                {this.state && this.state.addressInfo &&
                <Fragment>
                    <br/>
                    <Row gutter={16}>
                        <Col span={18}>
                            <Statistic
                                title="Balance"
                                value={this.state.addressInfo.balance}
                                precision={6}
                                prefix={
                                    <Icon type="dollar" theme="twoTone"/>
                                }
                            />
                        </Col>
                        <Col span={6}>
                            <Statistic
                                title="Transactions"
                                value={this.state.addressInfo.transactions.length}
                            />
                        </Col>
                    </Row>
                    <br/>
                    <Collapse bordered={false} defaultActiveKey={[]}>
                        <Collapse.Panel header="Transactions" key="1">
                            <TransactionTable
                                highlightName={this.state.address}
                                dataSource={this.state.addressInfo.transactions}
                            />
                        </Collapse.Panel>
                    </Collapse>
                </Fragment>
                }
            </Fragment>
        );
    }
}

export const WrappedGetAddressInfoForm = Form.create({name: 'get_address_info'})(GetAddressInfoForm);
