import React, {Fragment} from "react";
import {Button} from 'antd';
import Form from "antd/es/form";
import Input from "antd/es/input";
import Icon from "antd/es/icon";
import {WrappedFormUtils} from "antd/es/form/Form";
import InputNumber from "antd/es/input-number";
import {Notify, Post} from "../api/method.api";
import {AxiosResponse} from "axios";
import {MixResponse} from "../api/types";
import Steps from "antd/es/steps";
import {AutoTransferInput} from "../components/AutoTransferInput";

type Props = {
    form: WrappedFormUtils;
}

type State = {
    mixResponse?: MixResponse;
    buttonClicked: boolean;
    step: number;
    stepStatus: "wait" | "process" | "finish" | "error" | undefined;
    mixAmount: number;
    deadline: number;
}

// Uncomment for auto transfer
let allowAutoTransfer = false;
let id = 0;

class PostMixForm extends React.Component<Props, State> {
    componentDidMount() {
        this.add();
        this.setState({
            buttonClicked: false,
            deadline: 0,
            step: 0,
            stepStatus: "process",
        })
    }

    restart = () => {
        this.setState({
            buttonClicked: false,
            deadline: 0,
            step: 0,
            stepStatus: "process",
        })
    };

    remove = (k: any) => {
        const {form} = this.props;
        const keys = form.getFieldValue('keys');
        if (keys.length === 1) {
            return;
        }

        form.setFieldsValue({
            keys: keys.filter((key: any) => key !== k),
        });
    };

    add = () => {
        const {form} = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(id++);
        form.setFieldsValue({
            keys: nextKeys,
        });
    };

    countdownFinished = () => {
        this.setState({
            step: 1,
            stepStatus: "error"
        })

    };

    fundTransferred = () => {
        this.setState({
            step: 2,
            stepStatus: "process"
        })
    };

    handleAutoTransfer = (fromAddress: string) => {
        return () => {
            const payload = {
                fromAddress,
                toAddress: this.state.mixResponse!.depositAddress,
                amount: this.state.mixAmount
            };

            Post(`api/jobcoin/transactions`, payload)
                .then(response => {
                    const axiosResponse = response as AxiosResponse;
                    Notify(axiosResponse);
                    this.props.form.resetFields();
                    this.fundTransferred();
                })
                .catch(reason => {
                    const axiosResponse = reason.response as AxiosResponse;
                    console.log(axiosResponse);
                    Notify(axiosResponse);
                    this.setState({
                        stepStatus: "error"
                    })
                });
        }
    };

    handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const {keys, names} = values;
                const destinations = keys.map((key: string | number) => names[key]);
                const amount = values["amount"];

                const payload = {amount, destinations};

                Post(`api/mixer/mix`, payload)
                    .then(response => {
                        const axiosResponse = response as AxiosResponse;
                        Notify(axiosResponse);
                        const mixResponse = axiosResponse.data as MixResponse;
                        this.props.form.resetFields();
                        this.setState({
                            mixResponse,
                            step: 1,
                            mixAmount: amount,
                            stepStatus: "process",
                            // TODO: figure out deadline calculate
                            deadline: Date.now() + 1000 * 60
                        });
                    })
                    .catch(reason => {
                        const axiosResponse = reason.response as AxiosResponse;
                        console.log(axiosResponse);
                        Notify(axiosResponse);
                        this.setState({
                            stepStatus: "error"
                        })
                    });
            } else {
                this.setState({
                    buttonClicked: true
                });
            }
        });
    };

    render() {
        const {getFieldDecorator, getFieldValue} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 4},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 20},
            },
        };
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: {span: 24, offset: 0},
                sm: {span: 20, offset: 4},
            },
        };
        getFieldDecorator('keys', {initialValue: []});
        const keys = getFieldValue('keys');
        const formItems = keys.map((k: string | number | undefined, index: number) => (
            <Form.Item
                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                label={index === 0 ? 'Deposit Address' : ''}
                required={true}
                key={k}
            >
                {getFieldDecorator(`names[${k}]`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [
                        {
                            required: true,
                            whitespace: true,
                            message: "Fill in or delete deposit address!",
                        },
                    ],
                })(<Input placeholder="Address" style={{width: '60%', marginRight: 8}}/>)}
                {keys.length > 1 ? (
                    <Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        onClick={() => this.remove(k)}
                    />
                ) : null}
            </Form.Item>
        ));

        return (
            <Fragment>
                {this.state && this.state.step === 0 && (
                    <Form onSubmit={this.handleSubmit}>
                        {formItems}
                        <Form.Item {...formItemLayoutWithOutLabel}>
                            <Button type="dashed" onClick={this.add} style={{width: '60%'}}>
                                <Icon type="plus"/> Add field
                            </Button>
                        </Form.Item>
                        <Form.Item
                            labelCol={{span: 4}}
                            wrapperCol={{span: 12}}
                            label={"Amount"}
                            required={true}
                        >
                            {getFieldDecorator('amount', {
                                validateTrigger: ['onChange', 'onBlur'],
                                rules: [
                                    {
                                        required: true,
                                        whitespace: true,
                                        message: "Amount is required!",
                                    },
                                ],
                            })(<InputNumber min={0} step={0.001} style={{width: "100%"}} placeholder="Amount"/>)}
                        </Form.Item>
                        <Form.Item {...formItemLayoutWithOutLabel}>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                )}
                {this.state && (
                    <Steps current={this.state.step} status={this.state.stepStatus} direction={"vertical"}>
                        <Steps.Step title="Submit" description="Ask the mixer mix your funds"/>
                        <Steps.Step title="Move Funds" description={
                            (this.state.step === 0 && "Transfer from your wallet to the generated deposit address") ||
                            (this.state.step === 1 && (this.state.stepStatus !== "error") ? (
                                (<AutoTransferInput
                                    amount={this.state.mixAmount}
                                    depositAddress={this.state.mixResponse!.depositAddress}
                                    countdownFinished={this.countdownFinished}
                                    allowAutoTransfer={false}
                                    handleAutoTransfer={this.handleAutoTransfer}
                                    fundsTransferred={this.fundTransferred}
                                    deadline={this.state.deadline}
                                />)
                            ) : ("Mixer did not receive funds, mix abandoned")) ||
                            (this.state.step === 2 && `Funds transferred to ${this.state.mixResponse!.depositAddress}`)
                        }
                        />
                        <Steps.Step title="Wait Till Mixed"
                                    description="The mixer will distribute your funds within 100 seconds."/>
                    </Steps>

                )}
                {(this.state) && (this.state.step === 2 || this.state.stepStatus === "error") && (
                    <Button type={"primary"} size={"small"} onClick={this.restart}>
                        Restart
                        <Icon type={"redo"}/>
                    </Button>
                )}
            </Fragment>
        );
    }
}

export const WrappedPostMixForm = Form.create({name: 'post_mix'})(PostMixForm);
