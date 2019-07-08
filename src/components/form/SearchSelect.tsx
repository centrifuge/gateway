import React, { Component } from 'react';
import { Select, SelectProps } from 'grommet';
import { Omit } from 'grommet/utils';
// TODO add this to Axis
export interface SearchSelectItem {
  label: string;
  value: string;
}

interface SearchSelectState {
  options: SearchSelectItem[];
  selected: SearchSelectItem;
}

interface SearchSelectProps extends Omit<SelectProps,"selected">{
  options: any[];
  selected?: SearchSelectItem | SearchSelectItem[];
}


export default class SearchSelect<SearchSelectItem> extends Component<
  SearchSelectProps,
  SearchSelectState> {
  constructor(props) {
    super(props);
    this.state = {
      options: props.options,
      selected:
        props.selected,
    };
  }

  onChange = event => {
    this.setState({ selected: event.value,options: this.props.options }, () => {
      this.props.onChange && this.props.onChange(
        this.state.selected
      );
    });


  };

  onSearch = text => {
    const exp = new RegExp(text, 'i');
    this.setState({
      options: this.props.options.filter(o => exp.test(o.label)),
    });
  };

  render() {
    return (
      <Select
        plain
        size={'medium'}
        placeholder="Select"
        options={this.state.options}
        value={this.state.selected}
        labelKey="label"
        valueKey="value"
        onChange={this.onChange}
        onSearch={this.onSearch}
      />
    );
  }
}
