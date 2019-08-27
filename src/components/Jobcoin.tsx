import React from "react";
import {PageHeader, Tabs, Tag} from 'antd';
import {WrappedGetAddressInfoForm} from "../forms/GetAddressInfoForm";
import {WrappedGetAllTransactionsForm} from "../forms/GetAllTransactionsForm";
import {WrappedPostTransactionForm} from "../forms/PostTransactionForm";

const {TabPane} = Tabs;

type JobcoinProps = {}

type JobcoinState = {
    activePane: string
}

export class Jobcoin extends React.Component<JobcoinProps, JobcoinState> {
    componentDidMount() {
        this.state = {
            activePane: "info"
        }
    }

    render() {

        return (
            <PageHeader
                title="Jobcoin"
                subTitle="Send and Check Jobcoins"
                tags={[
                    <Tag key="1" color="green">Jobcoin API</Tag>,
                    <Tag key="2" color="magenta">Passthrough</Tag>,
                ]}
            >
                <Tabs defaultActiveKey="1" onChange={activePane => this.setState({activePane})}>
                    <TabPane tab="New Transaction" key="new"/>
                    <TabPane tab="Address Info" key="info"/>
                    <TabPane tab="All Transactions" key="all"/>
                </Tabs>
                {(this.state) ?
                    (
                        (this.state.activePane === "info" && <WrappedGetAddressInfoForm/>) ||
                        (this.state.activePane === "all" && <WrappedGetAllTransactionsForm/>) ||
                        (this.state.activePane === "new" && <WrappedPostTransactionForm/>)
                    ) : (
                        <WrappedPostTransactionForm/>
                    )
                }
            </PageHeader>
        );
    }
}