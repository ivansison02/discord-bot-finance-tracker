module.exports = (sequelize, DataTypes) => {
	return sequelize.define('budget', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
		},
        name: DataTypes.STRING,
		amount: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
        description: {
            type: DataTypes.STRING,
            defaultValue: '',
            allowNull: true,
        },
        type: {
            type: DataTypes.STRING,
            defaultValue: 'wants',
            allowNull: false,
        },
        user_id: DataTypes.STRING,
	}, {
		timestamps: false,
	});
};