module.exports = (sequelize, DataTypes) => {
	return sequelize.define('expenses', {
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
        payment_method: {
            type: DataTypes.STRING,
            defaultValue: 'cash',
            allowNull: false,
        },
        user_id: DataTypes.STRING,
        date: DataTypes.STRING,
	}, {
		timestamps: true,
	});
};