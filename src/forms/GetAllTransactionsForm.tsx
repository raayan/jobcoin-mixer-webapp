import React, {Fragment} from "react";
import Form from "antd/es/form";
import {Get} from "../api/method.api";
import {Transaction} from "../api/types";
import {AxiosResponse} from "axios";
import {TransactionTable} from "../components/TransactionTable";

type Props = {
    form: any,

}

type State = {
    transactions?: Array<Transaction>;
}

class GetAllTransactionsForm extends React.Component<Props, State> {
    componentDidMount() {
        this.props.form.validateFields();
        Get(`api/jobcoin/transactions`)
            .then(response => {
                const axiosResponse = response as AxiosResponse;
                const transactions = axiosResponse.data as Array<Transaction>;
                this.setState({
                    transactions: transactions
                });
            });
    };

    render() {
        return (
            <Fragment>
                {this.state && this.state.transactions &&
                <TransactionTable dataSource={this.state.transactions}/>
                }
            </Fragment>
        );
    }
}

export const WrappedGetAllTransactionsForm = Form.create({name: 'get_all_tranasctions'})(GetAllTransactionsForm);
