import React from "react";
import {Transaction} from "../api/types";
import Table from "antd/es/table";
import {Tooltip} from "antd";
import Badge from "antd/es/badge";
import Tag from "antd/es/tag";

type Props = {
    dataSource: Array<Transaction>,
    highlightName?: string
}

function highlight(name: string, match: string) {
    if (name === null) {
        return (<span><Tag>Jobcoin</Tag></span>)
    }
    return (name === match) ?
        (<span>
            {name}
            <Badge
                color={"cyan"}
                text={""}
                offset={[5, 0]}
            />
        </span>) : (<span>
            {name}
        </span>)
}

export class TransactionTable extends React.Component<Props> {

    render() {
        const highlightName = (this.props.highlightName) ? (this.props.highlightName) : ("");

        const columns = [
            {
                title: 'From',
                dataIndex: 'fromAddress',
                key: 'fromAddress',
                width: '30%',
                render: (address: string) => highlight(address, highlightName)
            },
            {
                title: 'To',
                dataIndex: 'toAddress',
                key: 'toAddress',
                width: '30%',
                render: (address: string) => highlight(address, highlightName)
            },
            {
                title: 'Amount',
                dataIndex: 'amount',
                key: 'amount',
                width: '10%'
            },
            {
                title: 'Date',
                dataIndex: 'timestamp',
                key: 'timestamp',
                render: (timestamp: string) => (<Tooltip title={timestamp}><span>Hover</span></Tooltip>)
            },
        ];

        return (
            <Table
                bordered={false}
                dataSource={this.props.dataSource}
                columns={columns}
                pagination={{pageSize: 5}}
            />
        )
    }
}