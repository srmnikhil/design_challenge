class SupplierController {
    constructor(supplierService) {
        this.supplierService = supplierService;
    }

    async createSupplier(req, res) {
        try {
            const supplier = await this.supplierService.createSupplier(req.body);
            res.status(201).json(supplier);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getSuppliers(req, res) {
        try {
            const suppliers = await this.supplierService.getSuppliers();
            res.status(200).json(suppliers);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateSupplier(req, res) {
        try {
            const updatedSupplier = await this.supplierService.updateSupplier(req.params.id, req.body);
            res.status(200).json(updatedSupplier);
        } catch (error) {
            res.status(error.message === "Supplier not found" ? 404 : 400).json({ message: error.message });
        }
    }

    async deleteSupplier(req, res) {
        try {
            await this.supplierService.deleteSupplier(req.params.id);
            res.status(200).json({ message: "Supplier deleted successfully" });
        } catch (error) {
            res.status(error.message === "Supplier not found" ? 404 : 500).json({ message: error.message });
        }
    }

    async bulkInsertSuppliers(req, res) {
        try {
            const result = await this.supplierService.bulkInsertSuppliers(req.body);
            res.status(201).json({
                message: "Suppliers inserted successfully",
                insertedCount: result.length,
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async rankSuppliers(req, res) { // Renamed for consistency
        try {
            const { skuIdsWithRequirement } = req.body;
            const skuIds = skuIdsWithRequirement.map((_) => _.skuId);
            if (!Array.isArray(skuIds) || skuIds.length === 0) {
                return res.status(400).json({ error: "skuIds must be a non-empty array" });
            }
            const rankedSuppliers = await this.supplierService.getRankedSuppliers(skuIdsWithRequirement);
            res.json(rankedSuppliers);
        } catch (error) {
            console.error("Error fetching suppliers:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

module.exports = SupplierController;