import PropTypes from 'prop-types';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const EmojiCell = (props) => {
	const { emoji, colSize, onPress, ...other } = props;

	return (
		<TouchableOpacity
			activeOpacity={0.5}
			onPress={onPress}
			style={{
				width: colSize,
				height: colSize,
				alignItems: "center",
				justifyContent: "center",
			}}
			{...other}
		>
			<Text style={{ color: "#FFFFFF", fontSize: colSize - 12 }}>
				{emoji}
			</Text>
		</TouchableOpacity>
	);
}

EmojiCell.propTypes = {
	emoji: PropTypes.string.isRequired,
	colSize: PropTypes.number,
	onPress: PropTypes.func,
}

export default EmojiCell;
