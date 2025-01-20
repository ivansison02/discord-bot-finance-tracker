module.exports = (sequelize, DataTypes) => {
	return sequelize.define('savings', {
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
        user_id: DataTypes.STRING,
	}, {
		timestamps: false,
	});
};