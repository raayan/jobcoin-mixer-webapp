import Tooltip from "antd/es/tooltip";
import Input from "antd/es/input";
import React, {Fragment} from "react";
import Countdown from "antd/es/statistic/Countdown";
import Tag from "antd/es/tag";
import {Button} from "antd";
import Icon from "antd/es/icon";

type Props = {
    depositAddress: string;
    amount: number;
    countdownFinished: () => void;
    handleAutoTransfer: Function;
    fundsTransferred: () => void;
    deadline: number;
    allowAutoTransfer: boolean;
}

type State = {
    fromAddress: string;
    canSubmit: boolean;
}

export class AutoTransferInput extends React.Component<Props, State> {
    componentDidMount() {
        this.setState({
            fromAddress: "",
            canSubmit: false
        })
    }

    onChangeFromAddress = (e: any) => {
        const fromAddress = e.target.value;
        this.setState({
            fromAddress
        })
    };

    render() {
        return (this.state && (
            <Fragment>
                <Countdown
                    title=""
                    value={this.props.deadline}
                    onFinish={this.props.countdownFinished}
                />
                {<span>{"Time remaining to transfer "}
                    <Tag color={"green"}>{this.props.amount}</Tag>
                    {"to "}
                    <Tag color={"magenta"}>{this.props.depositAddress}</Tag>
                </span>}
                <Tooltip
                    trigger={'focus'}
                    title={"Enter your address"}
                    placement="topLeft"
                >
                    {(this.props.allowAutoTransfer) &&
                    (<Input
                        style={{width: 200, display: "inline"}}
                        size={"small"}
                        {...this.props}
                        onChange={this.onChangeFromAddress}
                        placeholder="Your address"
                    />)}
                </Tooltip>
                <br/>
                <br/>
                {(this.props.allowAutoTransfer &&
                    (<div>
                        Transfer <Tag color={"green"}>{this.props.amount}</Tag>
                        from <Tag color={"purple"}>{(this.state && this.state.fromAddress) || "Your Address"}</Tag>
                        to <Tag color={"magenta"}>{this.props.depositAddress}</Tag>
                        <Button
                            type={"danger"}
                            size={"small"}
                            disabled={this.props.deadline <= 0 || (this.state && this.state.fromAddress.length <= 0)}
                            onClick={this.props.handleAutoTransfer(this.state.fromAddress)}
                        >Confirm Transfer</Button>
                    </div>)) || (
                    <Fragment>
                        <Button type={"primary"} size={"small"} onClick={this.props.fundsTransferred}>
                            I Transferred My Funds
                            <Icon type={"swap"}/>
                        </Button>
                    </Fragment>
                )}
            </Fragment>
        ));
    }
}