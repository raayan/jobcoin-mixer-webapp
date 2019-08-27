import React, {Component} from "react";
import {PageHeader} from 'antd';
import Tag from "antd/es/tag";
import {WrappedPostMixForm} from "../forms/PostMixForm";

type MixerProps = {}

type MixerState = {}


export class Mixer extends Component<MixerProps, MixerState> {

    render() {
        return (
            <PageHeader
                title="Mixer"
                subTitle="Submit a Mix"
                tags={[
                    <Tag color="geekblue">Mixer</Tag>,
                ]}
            >
                <WrappedPostMixForm/>
            </PageHeader>
        );
    }
}