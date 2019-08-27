import React, {Fragment} from "react";
import {Button} from 'antd';
import Form from "antd/es/form";
import Input from "antd/es/input";
import Icon from "antd/es/icon";
import {Notify, Post} from "../api/method.api";
import {AxiosResponse} from "axios";
import InputNumber from "antd/es/input-number";

function hasErrors(fieldsError: any) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

type Props = {
    form: any,
}

type State = {}

class PostTransactionForm extends React.Component<Props, State> {
    componentDidMount() {
        this.props.form.validateFields();
    };

    handleSubmit = (e: any) => {
        e.preventDefault();
        this.props.form.validateFields((err: any, values: any) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const fromAddress = values['fromAddress'];
                const toAddress = values['toAddress'];
                const amount = values['amount'];
                const payload = {fromAddress, toAddress, amount};

                Post(`api/jobcoin/transactions`, payload)
                    .then(response => {
                        const axiosResponse = response as AxiosResponse;
                        Notify(axiosResponse);
                        this.props.form.resetFields();
                    })
                    .catch(reason => {
                        const axiosResponse = reason.response as AxiosResponse;
                        console.log(axiosResponse);
                        Notify(axiosResponse);
                    });
            }
        });
    };

    render() {
        const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;

        const fromError = isFieldTouched('fromAddress') && getFieldError('fromAddress');
        const toError = isFieldTouched('toAddress') && getFieldError('toAddress');
        const amountError = isFieldTouched('amount') && getFieldError('amount');

        return (
            <Fragment>
                <Form onSubmit={this.handleSubmit} layout={"horizontal"}>
                    <Form.Item
                        labelCol={{span: 4}}
                        wrapperCol={{span: 12}}
                        label={"From"}
                        validateStatus={fromError ? 'error' : ''} help={fromError || ''}
                    >
                        {getFieldDecorator('fromAddress', {
                            rules: [{required: true, message: 'From Address Required'}],
                        })(
                            <Input
                                prefix={<Icon type="swap-left" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                placeholder="From Address"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item
                        labelCol={{span: 4}}
                        wrapperCol={{span: 12}}
                        label={"To"}
                        validateStatus={toError ? 'error' : ''} help={toError || ''}
                    >
                        {getFieldDecorator('toAddress', {
                            rules: [{required: true, message: 'To Address Required'}],
                        })(
                            <Input
                                prefix={<Icon type="swap-right" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                placeholder="To Address"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item
                        labelCol={{span: 4}}
                        wrapperCol={{span: 12}}
                        label={"Amount"}
                        validateStatus={amountError ? 'error' : ''} help={amountError || ''}
                    >
                        {getFieldDecorator('amount', {
                            rules: [{required: true, message: 'Amount Required!'}],
                        })(
                            <InputNumber
                                min={0}
                                step={0.001}
                                style={{width: "100%"}}
                                placeholder="Amount"/>,
                        )}

                    </Form.Item>
                    <Form.Item
                        wrapperCol={{span: 12, offset: 4}}
                    >
                        <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
                            Send
                        </Button>
                    </Form.Item>
                </Form>
            </Fragment>
        );
    }
}

export const WrappedPostTransactionForm = Form.create({name: 'post_mix'})(PostTransactionForm);
