import { Component } from 'react';
import { Box, Select, Text } from 'grommet';
import React from 'react';
import { FieldRenderProps } from 'react-final-form';

export interface SearchSelectItem {
  label: string;
  value: string;
}

interface SearchSelectState {
  items: SearchSelectItem[];
  selected: SearchSelectItem | SearchSelectItem[];
}

export default class SearchSelect<
  SearchSelectItem
> extends Component<
  FieldRenderProps & {
    items: any[];
    label: string;
    selected?: SearchSelectItem | SearchSelectItem[];
  },
  SearchSelectState
> {
  constructor(props) {
    super(props);
    this.state = {
      items: props.items,
      selected:
        props.selected || (props.multiple ? [] : { label: '', value: '' }),
    };
  }

  onChange = change => {
    this.setState({ selected: change.value }, () => {
      this.props.onChange(
        Array.isArray(this.state.selected)
          ? this.state.selected.map(opt => opt.value)
          : this.state.selected.value,
      );
    });
  };

  onSearch = text => {
    const exp = new RegExp(text, 'i');
    this.setState({
      /// @ts-ignore - https://github.com/final-form/react-final-form/issues/398
      items: this.props.items.filter(o => exp.test(o.label)),
    });
  };

  render() {
    return (
      <Select
        plain
        size={"medium" as any}
        placeholder="Select"
        options={this.state.items}
        value={this.state.selected as any}
        labelKey="label"
        valueKey="value"
        onChange={this.onChange}
        onSearch={this.onSearch}
      />
    );
  }
}
