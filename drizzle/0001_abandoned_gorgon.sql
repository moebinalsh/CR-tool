CREATE TABLE `change_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`reason` text NOT NULL,
	`affectedResources` text NOT NULL,
	`assigneeId` int NOT NULL,
	`prLink` varchar(512),
	`rollbackPlan` text NOT NULL,
	`status` enum('draft','pending','approved','rejected','implemented','rolled_back') NOT NULL DEFAULT 'draft',
	`priority` enum('low','medium','high','critical') NOT NULL DEFAULT 'medium',
	`createdById` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`scheduledDate` timestamp,
	`implementedAt` timestamp,
	CONSTRAINT `change_requests_id` PRIMARY KEY(`id`)
);
